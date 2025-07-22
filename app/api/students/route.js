import { NextResponse } from "next/server"

// GitHub configuration
const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const GITHUB_REPO = process.env.GITHUB_REPO
const GITHUB_API_URL = "https://api.github.com"

// GET - Fetch student profiles
export async function GET() {
  try {
    const response = await fetch(`${GITHUB_API_URL}/repos/${GITHUB_REPO}/contents/data/students.json`, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
    })

    if (response.status === 404) {
      // File doesn't exist yet, return empty object
      return NextResponse.json({})
    }

    if (!response.ok) {
      throw new Error("Failed to fetch student data from GitHub")
    }

    const data = await response.json()
    const content = JSON.parse(Buffer.from(data.content, "base64").toString())

    return NextResponse.json(content)
  } catch (error) {
    console.error("Error fetching student data:", error)
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 })
  }
}

// POST - Save student profile
export async function POST(request) {
  try {
    const { studentId, profileData } = await request.json()

    // Get existing data
    let existingData = {}
    let sha = null

    try {
      const response = await fetch(`${GITHUB_API_URL}/repos/${GITHUB_REPO}/contents/data/students.json`, {
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

    // Update student profile
    existingData[studentId] = { ...existingData[studentId], ...profileData }

    // Prepare content for GitHub
    const content = Buffer.from(JSON.stringify(existingData, null, 2)).toString("base64")

    const body = {
      message: `Update profile for student ${studentId}`,
      content: content,
    }

    if (sha) {
      body.sha = sha
    }

    // Save to GitHub
    const response = await fetch(`${GITHUB_API_URL}/repos/${GITHUB_REPO}/contents/data/students.json`, {
      method: "PUT",
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error("Failed to save student data to GitHub")
    }

    return NextResponse.json({ success: true, message: "Student profile saved successfully" })
  } catch (error) {
    console.error("Error saving student data:", error)
    return NextResponse.json({ error: "Failed to save data" }, { status: 500 })
  }
}
