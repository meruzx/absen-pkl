import { NextResponse } from "next/server"

// GitHub configuration
const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const GITHUB_REPO = process.env.GITHUB_REPO // format: "username/repo-name"
const GITHUB_API_URL = "https://api.github.com"

// GET - Fetch attendance data
export async function GET() {
  try {
    const response = await fetch(`${GITHUB_API_URL}/repos/${GITHUB_REPO}/contents/data/attendance.json`, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
    })

    if (response.status === 404) {
      // File doesn't exist yet, return empty array
      return NextResponse.json([])
    }

    if (!response.ok) {
      throw new Error("Failed to fetch data from GitHub")
    }

    const data = await response.json()
    const content = JSON.parse(Buffer.from(data.content, "base64").toString())

    return NextResponse.json(content)
  } catch (error) {
    console.error("Error fetching attendance data:", error)
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 })
  }
}

// POST - Save attendance data
export async function POST(request) {
  try {
    const attendanceData = await request.json()

    // First, get existing data
    let existingData = []
    let sha = null

    try {
      const response = await fetch(`${GITHUB_API_URL}/repos/${GITHUB_REPO}/contents/data/attendance.json`, {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
      })

      if (response.ok) {
        const data = await response.json()
        existingData = JSON.parse(Buffer.from(data.content, "base64").toString())
        sha = data.sha
      }
    } catch (error) {
      // File doesn't exist yet, that's okay
    }

    // Add new attendance record
    existingData.push(attendanceData)

    // Prepare the content for GitHub
    const content = Buffer.from(JSON.stringify(existingData, null, 2)).toString("base64")

    const body = {
      message: `Add attendance record for ${attendanceData.studentName} on ${attendanceData.date}`,
      content: content,
    }

    if (sha) {
      body.sha = sha
    }

    // Save to GitHub
    const response = await fetch(`${GITHUB_API_URL}/repos/${GITHUB_REPO}/contents/data/attendance.json`, {
      method: "PUT",
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error("Failed to save data to GitHub")
    }

    return NextResponse.json({ success: true, message: "Attendance saved successfully" })
  } catch (error) {
    console.error("Error saving attendance data:", error)
    return NextResponse.json({ error: "Failed to save data" }, { status: 500 })
  }
}
