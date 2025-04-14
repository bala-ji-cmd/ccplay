import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse/sync'
import { stringify } from 'csv-stringify/sync'

interface CaptionRecord {
  user_id: string
  challenge_date: string
  caption: string
  score: number
  submission_time: string
}

const CAPTIONS_FILE = 'captions.csv'
const RESULTS_COMPUTED_FILE = 'results_computed.json'

export function getCaptionsFilePath(challenge_date: string): string {
  const dirPath = path.join(process.cwd(), 'public', 'captions', challenge_date)
  // Ensure directory exists
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
  return path.join(dirPath, CAPTIONS_FILE)
}

export function getResultsComputedPath(challenge_date: string): string {
  const dirPath = path.join(process.cwd(), 'public', 'captions', challenge_date)
  // Ensure directory exists
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
  return path.join(dirPath, RESULTS_COMPUTED_FILE)
}

export function isResultsComputed(challenge_date: string): boolean {
  const filePath = getResultsComputedPath(challenge_date)
  if (!fs.existsSync(filePath)) {
    return false
  }

  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const data = JSON.parse(content)
    return data.computed === true
  } catch {
    return false
  }
}

export function markResultsComputed(challenge_date: string): void {
  const filePath = getResultsComputedPath(challenge_date)
  fs.writeFileSync(filePath, JSON.stringify({
    computed: true,
    computedAt: new Date().toISOString()
  }))
}

export function readCaptions(challenge_date: string): CaptionRecord[] {
  const filePath = getCaptionsFilePath(challenge_date)
  if (!fs.existsSync(filePath)) {
    return []
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8')
  if (!fileContent.trim()) {
    return []
  }

  return parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
  })
}

export function writeCaptions(captions: CaptionRecord[], challenge_date: string): void {
  const filePath = getCaptionsFilePath(challenge_date)
  const csvContent = stringify(captions, {
    header: true,
    columns: ['user_id', 'challenge_date', 'caption', 'score', 'submission_time'],
  })
  fs.writeFileSync(filePath, csvContent)
  console.log("content written to the file : ", filePath)
}

export function addCaption(record: Omit<CaptionRecord, 'score'>): void {
  const captions = readCaptions(record.challenge_date)
  const newRecord: CaptionRecord = {
    ...record,
    score: 0,
  }
  captions.push(newRecord)
  console.log("captions added, now no of captions : ", captions.length)
  writeCaptions(captions, record.challenge_date)
}

export function updateCaptionScores(challenge_date: string, scores: { [key: string]: number }): void {
  const captions = readCaptions(challenge_date)
  const updatedCaptions = captions.map(caption => ({
    ...caption,
    score: scores[caption.caption] || caption.score
  }))
  writeCaptions(updatedCaptions, challenge_date)
}

export function getTopCaptions(date: string, limit: number = 20): CaptionRecord[] {

 

  const captions = readCaptions(date)
  return captions
    .filter(caption => caption.challenge_date === date)
    .sort((a, b) => {
      // First sort by score (descending)
      const scoreDiff = b.score - a.score
      if (scoreDiff !== 0) return scoreDiff
      // Then sort by submission time (ascending)
      return new Date(a.submission_time).getTime() - new Date(b.submission_time).getTime()
    })
    .slice(0, limit)
} 