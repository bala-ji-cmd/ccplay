# subscription and access management system report

```mermaid
sequencediagram
    participant user
    participant ui
    participant paymentgateway
    participant subscriptionservice
    participant accesscontrol
    participant database
    
    %% free tier initiation
    user->>ui: signs up
    ui->>subscriptionservice: create free tier subscription
    subscriptionservice->>database: insert subscription record<br/>(plan_type='free', status='active',<br/>credits_allocated=50, credits_left=50)
    database-->>subscriptionservice: subscription created
    subscriptionservice-->>ui: free subscription activated
    ui-->>user: account created with free tier access

    %% paid tier purchase
    user->>ui: selects paid tier
    ui->>paymentgateway: process payment
    paymentgateway-->>ui: payment successful
    ui->>subscriptionservice: upgrade to paid tier
    subscriptionservice->>database: update subscription<br/>(plan_type=selectedtier, status='active',<br/>plan_start_date=now(), plan_end_date=now()+30days,<br/>credits_allocated=tiercredits, credits_left=tiercredits)
    subscriptionservice->>database: create payment record in subscription_payments
    subscriptionservice->>database: create audit record in subscription_audit
    database-->>subscriptionservice: records updated
    subscriptionservice-->>ui: subscription upgraded
    ui-->>user: confirmation of purchase

    %% credit usage
    user->>ui: performs action (draw/learn/animate)
    ui->>accesscontrol: check access permission
    accesscontrol->>database: get subscription details
    database-->>accesscontrol: return subscription status and plan_type
    
    alt subscription active & sufficient credits
        accesscontrol->>accesscontrol: verify feature access based on plan_type
        accesscontrol-->>ui: access granted
        ui->>subscriptionservice: deduct credits for action
        subscriptionservice->>database: update credits_left = credits_left - actioncost
        subscriptionservice->>database: create record in credit_usage
        database-->>subscriptionservice: credits updated
        subscriptionservice-->>ui: action processed
        ui-->>user: action completed
    else insufficient credits
        accesscontrol-->>ui: credits exhausted
        ui->>subscriptionservice: update subscription status
        subscriptionservice->>database: update status='suspended'
        database-->>subscriptionservice: status updated
        subscriptionservice-->>ui: subscription suspended
        ui-->>user: subscription suspended, prompt to upgrade
    else feature not available in current tier
        accesscontrol-->>ui: feature not available
        ui-->>user: prompt to upgrade tier
    end

    %% auto-renewal
    note over subscriptionservice: scheduled job runs for subscriptions<br/>where plan_end_date is near
    subscriptionservice->>database: get subscriptions due for renewal
    database-->>subscriptionservice: return subscriptions
    
    loop for each subscription due
        subscriptionservice->>paymentgateway: process renewal payment
        
        alt payment successful
            paymentgateway-->>subscriptionservice: payment succeeded
            subscriptionservice->>database: update subscription<br/>(plan_start_date=now(), plan_end_date=now()+30days,<br/>credits_allocated=tiercredits, credits_left=tiercredits,<br/>status='active')
            subscriptionservice->>database: create payment record
            database-->>subscriptionservice: subscription renewed
        else payment failed
            paymentgateway-->>subscriptionservice: payment failed
            subscriptionservice->>database: update status='payment_failed'
            database-->>subscriptionservice: status updated
            subscriptionservice->>user: send payment failure notification
        end
    end

    %% cancellation
    user->>ui: requests cancellation
    ui->>subscriptionservice: cancel subscription
    subscriptionservice->>database: update status='cancelled'
    database-->>subscriptionservice: status updated
    subscriptionservice-->>ui: subscription cancelled
    ui-->>user: cancellation confirmed
```

this report provides a detailed blueprint for building a robust subscription and access management system for your platform, based on the requirements you've outlined. we'll delve into the system's behavior, data structures, and workflows to ensure a clear understanding of its functionality.

## 1. subscription management

this section details the lifecycle, purchase, and renewal processes of user subscriptions.

### 1.1. lifecycle

the subscription lifecycle will follow these transitions:

- **free tier initiation - done:**
    - upon user signup, a new subscription record will be created with the `plan_type` set to 'free', `status` as 'active', `credits_allocated` as 50, and `credits_left` as 50. the `plan_start_date` will be the signup timestamp, and the `plan_end_date` can be set to a far future date or null for free tiers, as it doesn't expire based on time.
    - the user will have immediate access to the 'draw' feature (based on the free tier access level).
- **purchase of a paid tier - stripe gatway setup done:**
    - a user on the free tier (or potentially an existing paid tier user looking to upgrade) will select a paid tier.
    - upon successful payment (detailed in section 1.2), the system will:
        - update the existing subscription record for the `user_id`.
        - set the `plan_type` to the purchased tier.
        - set the `plan_start_date` to the payment date.
        - set the `plan_end_date` to the payment date + 30 days.
        - replenish `credits_allocated` and `credits_left` according to the purchased tier.
        - update the `status` to 'active'.
        - create a record in the `subscription_audit` table detailing the transition.
- **active subscription - done:**
    - while the subscription is 'active', the user has access to the features corresponding to their `plan_type` and can consume credits for interactions.
- **credit exhaustion - done:**
    - whenever a user performs an action (draw, learn, animate), the system will check if they have sufficient `credits_left`.
    - if sufficient credits are available, the corresponding number of credits will be deducted from `credits_left`, and a record will be created in the `credit_usage` table.
    - if `credits_left` reaches zero:
        - the `status` of the subscription in the `subscriptions` table will be updated to 'suspended'.
        - the user will be notified that their credits are exhausted.
        - access to the platform's features (draw, learn, animate) will be restricted as per the access routing rules (section 4).
- **upgrade to the next tier (while suspended):**
    - if a user with a 'suspended' subscription due to credit exhaustion chooses to upgrade to a higher tier:
        - upon successful payment (section 1.2), the system will:
            - update the existing subscription record for the `user_id`.
            - set the `plan_type` to the upgraded tier.
            - set the `plan_start_date` to the payment date.
            - set the `plan_end_date` to the payment date + 30 days.
            - calculate the new `credits_allocated` based on the new plan. the `credits_left` will be set to this new allocation (no carry-over of used credits from the previous plan in this scenario of exhaustion and upgrade).
            - update the `status` to 'active'.
            - create a record in the `subscription_audit` table detailing the upgrade.
- **waiting for the next billing cycle (while suspended):**
    - if a user with a 'suspended' subscription due to credit exhaustion does not upgrade, they will need to wait for their next billing cycle.
    - on the `plan_end_date`, the auto-renewal process (section 1.3.1) will trigger:
        - if auto-renewal is successful (payment is processed), the `plan_start_date` will be updated to the current date, the `plan_end_date` will be updated to the current date + 30 days, `credits_allocated` and `credits_left` will be replenished as per their current `plan_type`, and the `status` will be set back to 'active'.
        - if auto-renewal fails, the `status` could be set to 'cancelled' or a 'pending payment' state, depending on your desired handling of failed renewals.

### 1.2. purchase

the purchase process for a subscription tier involves the following steps:

- **tier selection:** the user navigates to a pricing page and selects the desired subscription tier (tier 1, tier 2, or tier 3).
- **payment processing:**
    - the user will be prompted to enter their payment details.
    - payment gateway integration will be necessary to securely process the payment.
    - the system should store a payment reference id (`payment_refid` in the `payments` table) returned by the payment gateway for tracking purposes. sensitive payment details should ideally be handled and tokenized by the payment gateway and not stored directly in your database.
- **database updates (upon successful payment):**
    - a new record will be inserted into the `subscription_payments` table with:
        - `subscription_id`: the id of the user's subscription record.
        - `user_id`: the id of the user.
        - `amount`: the amount paid.
        - `payment_date`: the timestamp of the successful payment.
        - `payment_reference`: the reference id from the payment gateway.
    - the existing record in the `subscriptions` table for the `user_id` will be updated:
        - `plan_type`: set to the purchased tier.
        - `plan_start_date`: set to the `payment_date`.
        - `plan_end_date`: set to `payment_date` + 30 days.
        - `credits_allocated`: set to the credit allocation for the purchased tier (e.g., tier 1: x credits, tier 2: y credits, tier 3: z credits).
        - `credits_left`: set to the same value as `credits_allocated`.
        - `status`: set to 'active'.
- **database updates (upon upgrade - if applicable from suspended state):**
    - similar to a new purchase, but ensure the correct `subscription_id` is used for updating the existing record. `credits_left` will be reset to the full allocation of the new tier.

### 1.3. renewal

subscription renewal can happen automatically or upon user cancellation.

### 1.3.1. auto-renewal

- **scheduled process:** a scheduled job (e.g., a cron job or a background task) will run daily to identify subscriptions whose `plan_end_date` is approaching (or has passed).
- **renewal attempt:** for each such subscription with `status` as 'active' (and potentially not explicitly cancelled), the system will attempt to process a renewal payment using the stored payment details (or a payment method the user needs to re-authorize if required by the payment gateway).
- **successful renewal:**
    - a new record will be inserted into the `subscription_payments` table.
    - the `subscriptions` table will be updated:
        - `plan_start_date`: set to the current date.
        - `plan_end_date`: set to the current date + 30 days.
        - `credits_allocated`: replenished to the full allocation for the current `plan_type`.
        - `credits_left`: reset to the same value as `credits_allocated`.
        - `status`: remains 'active'.
- **failed renewal:**
    - the `status` in the `subscriptions` table could be updated to 'payment_failed' or 'suspended'.
    - the user should be notified about the failed payment and prompted to update their payment information.
    - you might implement a retry mechanism for failed payments.
    - if payment continues to fail after a certain period, the subscription could be automatically cancelled.

### 1.3.2. cancellation

- **on-demand cancellation:** users will have an option within their account settings to cancel their subscription.
- **cancellation process:**
    - when a user initiates cancellation, the `status` in the `subscriptions` table should be updated to 'cancelled'.
    - the `plan_end_date` will remain as it was at the time of cancellation. the user will typically retain access to the platform and their remaining credits until the `plan_end_date`.
    - auto-renewal will be disabled for this subscription.
    - you might want to record the cancellation date in the `subscriptions` table or in a separate cancellation audit log.

## 2. credits system

this section outlines how credits are allocated, consumed, and managed within the system.

### 2.1. fixed credits per tier

each subscription tier will have a predefined number of credits allocated per billing cycle (monthly). this needs to be configured and stored within your application (e.g., in configuration files or a database table for plans).

- **free tier:** 50 credits
- **tier 1:** [define credit amount]
- **tier 2:** [define credit amount]
- **tier 3:** [define credit amount]

### 2.2. credit consumption

credits will be deducted based on the type of interaction the user performs:

- **draw with ai:** 25 credits per successful drawing.
- **learn with ai:** 50 credits per unit action (define clearly what constitutes one "unit action" in the learning module).
- **animate with ai:** 100 credits per unit action (define clearly what constitutes one "unit action" in the animation module).

### 2.3. free tier credit limit

the free tier is initialized with 50 credits, allowing for a maximum of two 'draw with ai' interactions before the credits are exhausted and the subscription is suspended.

### 2.4. tier-based routing and access control

access to features will be governed by the user's current `plan_type`:

- **tier 1:** users with `plan_type` 'tier1' (or the free tier) will only have access to the 'draw with ai' feature. attempts to access 'learn with ai' or 'animate with ai' should be denied with an appropriate message prompting them to upgrade.
- **tier 2:** users with `plan_type` 'tier2' will have access to both 'draw with ai' and 'learn with ai' features. access to 'animate with ai' should be denied with an upgrade prompt.
- **tier 3:** users with `plan_type` 'tier3' will have access to all three features: 'draw with ai', 'learn with ai', and 'animate with ai'.

this access control should be implemented at both the ui level (hiding or disabling features) and the backend level (preventing the execution of unauthorized actions).

## 3. entities and database schema behavior

this section elaborates on how the database entities behave in response to different system events.

### 3.1. `subscriptions` table

- **signup:** a new record is inserted with `plan_type` = 'free', `credits_allocated` = 50, `credits_left` = 50, `status` = 'active', `plan_start_date` = signup timestamp, and `plan_end_date` potentially null or a far future date.
- **purchase:** the existing record for the `user_id` is updated with the new `plan_type`, `plan_start_date`, `plan_end_date` (payment date + 30 days), `credits_allocated`, `credits_left` (equal to `credits_allocated`), and `status` = 'active'.
- **credit exhaustion:** the `status` of the record is updated to 'suspended' when `credits_left` reaches 0.
- **upgrade (from suspended):** the existing record is updated with the new `plan_type`, `plan_start_date` (payment date), `plan_end_date` (payment date + 30 days), `credits_allocated`, `credits_left` (equal to new `credits_allocated`), and `status` = 'active'.
- **auto-renewal:** the `plan_start_date`, `plan_end_date`, `credits_allocated`, `credits_left` are updated, and `status` remains 'active' (if successful). if renewal fails, `status` might change to 'payment_failed' or 'suspended'.
- **cancellation:** the `status` is updated to 'cancelled'.

### 3.2. `subscription_payments` table

- a new record is inserted whenever a successful payment occurs for a plan purchase or renewal.
- `subscription_id` links this payment to the specific subscription.
- `user_id` provides another way to associate the payment with the user.
- `payment_reference` is crucial for tracking payments with the payment gateway.

### 3.3. `credit_usage` table

- a new record is inserted every time a user successfully consumes credits for an action (draw, learn, animate).
- `subscription_id` links the credit usage to the user's current subscription.
- `usage_type` indicates the type of action that consumed credits.
- `credits_used` records the number of credits deducted.
- `usage_date` timestamps the credit consumption.

### 3.4. `subscription_audit` table

- a new record is inserted whenever a significant change occurs to a subscription, such as:
    - transition from 'free' to a paid tier.
    - upgrade from one paid tier to another.
    - potentially, suspension and reactivation due to credit exhaustion/renewal.
- `oldplan` and `newplan` will store the `plan_type` before and after the change, respectively.
- `sub_id` links to the specific subscription being audited.

## 4. access routing and control

this is a critical aspect of ensuring users only access features they are entitled to based on their subscription status and plan.

### 4.1. on page load verification

- upon any page load that requires access to the platform's core features (draw, learn, animate), the system must perform the following checks:
    1. **retrieve subscription status:** fetch the current subscription record for the logged-in user from the `subscriptions` table.
    2. **check subscription `status`:**
        - if `status` is 'suspended':
            - check the `plan_type`. if it's 'free', redirect the user to a page prompting them to purchase a paid tier.
            - if it's a paid tier, redirect the user to a page informing them that their credits are exhausted and offering an upgrade option.
        - if `status` is 'cancelled' or any other inactive state (depending on your implementation of failed renewals), restrict access to core features and potentially display a message about their subscription status.
        - if `status` is 'active': proceed to the next step.
    3. **check `credits_left`:**
        - if `credits_left` is 0 (and `status` is 'active' - this shouldn't ideally happen if the `status` is correctly updated upon exhaustion, but it's a safeguard), treat it as a 'suspended' state and follow the logic above.
        - if `credits_left` is greater than 0: allow the user to browse.

### 4.2. product access control

when a user attempts to use one of the core features (draw, learn, animate), the system must enforce access based on their `plan_type`:

1. **identify the feature being accessed:** determine which feature the user is trying to use.
2. **retrieve user's `plan_type`:** fetch the current subscription record for the logged-in user.
3. **authorize access:**
    - if `plan_type` is 'tier1' (or 'free'): allow access to 'draw with ai' only. deny access to 'learn with ai' and 'animate with ai' with a clear message about upgrading.
    - if `plan_type` is 'tier2': allow access to 'draw with ai' and 'learn with ai'. deny access to 'animate with ai' with an upgrade message.
    - if `plan_type` is 'tier3': allow access to all three features.
4. **credit deduction (if access allowed):** if the user is authorized to use the feature, check if they have enough `credits_left` for the intended action.
    - if sufficient credits are available, deduct the credits and record the usage in the `credit_usage` table.
    - if insufficient credits are available, prevent the action and display a message indicating they need more credits or should consider upgrading.

### 4.3. implementation considerations for access control

- **middleware/guards:** implement middleware or route guards in your application framework to handle the page load verification and api endpoint protection. this centralizes the access control logic.
- **backend checks:** always perform backend checks for authorization and credit availability before processing any action. do not rely solely on frontend ui restrictions, as these can be bypassed.
- **clear user feedback:** provide clear and informative messages to users when access is restricted due to subscription status, credit exhaustion, or plan limitations. guide them on how to resolve the issue (e.g., purchase a tier, upgrade, or wait for renewal).

## 5. summary of system behavior

in summary, the system will behave as follows:

- users start with a free tier offering limited credits and access to the 'draw' feature.
- they can purchase paid tiers to gain more credits and access additional features ('learn' for tier 2, 'animate' for tier 3).
- successful purchases and renewals update the user's subscription record with new credits, a new billing cycle, and an 'active' status.
- credit usage for each interaction is tracked, and the user's remaining credits are decremented.
- when credits are exhausted, the subscription status becomes 'suspended', and access to features is restricted based on the access routing rules.
- users can upgrade from a suspended state to immediately regain access and credits. otherwise, they must wait for the next billing cycle for credits to be refreshed.
- auto-renewal ensures continuous service, while users have the option to cancel their subscription.
- comprehensive database tables (`subscriptions`, `subscription_payments`, `credit_usage`, `subscription_audit`) will store all relevant information about subscriptions, payments, credit consumption, and subscription changes.
- robust access control mechanisms will ensure that users can only access features within their subscription plan and with sufficient credits.

this detailed report should provide a solid foundation for building your subscription and access management system. remember to consider edge cases, error handling, and thorough testing during the development process. good luck!