export function Faq() {
  return (
    <section className="container mx-auto py-16 px-4 mt-20">
      <h2
        className="text-3xl md:text-5xl font-extrabold text-center mb-6"
        style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
      >
        <span className="bg-[#FFD747] text-[#4A66E0] px-4 py-2 rounded-xl inline-block transform -rotate-2">
          Got Questions?
        </span>
        <span className="text-[#FF4D79] px-2">We've Got</span>
        <span className="bg-[#4A66E0] text-white px-4 py-2 rounded-xl inline-block transform rotate-2 ml-2">
          Answers!
        </span>
      </h2>

      <p className="text-xl text-center text-[#5D5D5D] mb-12 max-w-3xl mx-auto">
        Here are some frequently asked questions about our AI-powered Cocomelon Play platform!
      </p>

      {/* FAQ Items */}
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-md p-6 border-2 border-[#FFD747]">
          <h3 className="text-xl font-bold text-[#4A66E0] flex items-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#4A66E0"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-help-circle"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <path d="M12 17h.01" />
            </svg>
            What is Cocomelon Play?
          </h3>
          <p className="text-[#5D5D5D] mt-3">
            Cocomelon Play is a creative space for kids to play with AI, inspired by the wonderful world of Cocomelon! From creating drawings of JJ and his friends to bringing your Cocomelon scenes to life with animation, the possibilities are endless. It's all about making drawing fun and imaginative for young Cocomelon fans.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border-2 border-[#FFD747]">
          <h3 className="text-xl font-bold text-[#4A66E0] flex items-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#4A66E0"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-coins"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M14.31 8l5.74 9.94M9.69 8h11.48M7.38 12l5.74-9.94M9.69 16 3.95 6.06M14.31 16H2.83m13.79-4-5.74 9.94" />
            </svg>
            What are AI Credits in Cocomelon Play?
          </h3>
          <p className="text-[#5D5D5D] mt-3">
            Credits are what Cocomelon Play uses to help you create amazing drawings and animations with JJ, Cody, and Astor. It takes credits when you ask them to add things to your drawings, change colors, or make your characters move. Think of them as magic sparks that power the fun!
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border-2 border-[#FFD747]">
          <h3 className="text-xl font-bold text-[#4A66E0] flex items-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#4A66E0"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-refresh-cw"
            >
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
            How do Cocomelon Play credits refill?
          </h3>
          <p className="text-[#5D5D5D] mt-3">
            At the beginning of your billing cycle (usually once a month), your Cocomelon Play account will automatically get a fresh set of credits, ready for more creative adventures!
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border-2 border-[#FFD747]">
          <h3 className="text-xl font-bold text-[#4A66E0] flex items-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#4A66E0"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-calendar"
            >
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
            When will I get charged for Cocomelon Play?
          </h3>
          <p className="text-[#5D5D5D] mt-3">
            If you sign up for a monthly plan, you'll be charged every month on the date you started your subscription. If you choose an annual plan, you'll be charged every year on that same date.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border-2 border-[#FFD747]">
          <h3 className="text-xl font-bold text-[#4A66E0] flex items-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#4A66E0"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-alert-circle"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" x2="12" y1="8" y2="12" />
              <line x1="12" x2="12.01" y1="16" y2="16" />
            </svg>
            What if I run out of credits before the month ends in Cocomelon Play?
          </h3>
          <p className="text-[#5D5D5D] mt-3">
            If you use up all your credits before your next refill date, you might need to wait until your credits are renewed at the start of your next billing cycle. Depending on your subscription, there might also be options to purchase more credits if you want to keep creating without waiting.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border-2 border-[#FFD747]">
          <h3 className="text-xl font-bold text-[#4A66E0] flex items-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#4A66E0"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-x-circle"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="m15 9-6 6" />
              <path d="m9 9 6 6" />
            </svg>
            What if I want to cancel my Cocomelon Play subscription?
          </h3>
          <p className="text-[#5D5D5D] mt-3">
            We'd be sad to see you go! But we want to make it easy. You can usually manage your subscription and find the cancellation options within your account settings in the Cocomelon Play platform. If you have trouble, you can also reach out to our support team for help.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border-2 border-[#FFD747]">
          <h3 className="text-xl font-bold text-[#4A66E0] flex items-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#4A66E0"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-undo"
            >
              <path d="M3 7v6h6" />
              <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
            </svg>
            What is your refund policy for Cocomelon Play?
          </h3>
          <p className="text-[#5D5D5D] mt-3">
            Generally, subscription purchases are non-refundable. However, if you have any specific issues or concerns, please contact our customer support team, and they will be happy to assist you.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border-2 border-[#FFD747]">
          <h3 className="text-xl font-bold text-[#4A66E0] flex items-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#4A66E0"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-shield-check"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Is Cocomelon Play safe for my child?
          </h3>
          <p className="text-[#5D5D5D] mt-3">
            Yes, child safety is our top priority. Cocomelon Play adheres to strict child privacy regulations (COPPA). There are no direct communication features. Sharing will require parental consent or device-level options. We are committed to a safe and fun creative environment.
          </p>
        </div>
      </div>
    </section>
  )
} 