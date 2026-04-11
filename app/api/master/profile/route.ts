import { NextResponse } from "next/server"
import type { MasterProfileConfig } from "@/lib/types"

// In-memory storage for demo (in production, this would be in a database)
let masterProfiles: Record<string, MasterProfileConfig> = {
  "1": {
    bio: "Профессиональный тату-мастер с 10-летним опытом. Специализируюсь на японской традиционной татуировке и неотраде.",
    tags: ["Японский стиль", "Неотрад", "Блэкворк", "Орнаментал"],
    sections: {
      showPortfolio: true,
      showServices: true,
      showCalculator: true,
      showReviews: true,
    },
    calculatorConfig: {
      variables: [
        { id: "a", name: "a", label: "Размер (см)", type: "slider", defaultValue: 15, min: 5, max: 30, step: 1, unit: "см" },
        { id: "b", name: "b", label: "Сложность", type: "select", defaultValue: 2, options: [
          { value: 1, label: "Контур" },
          { value: 2, label: "Тени" },
          { value: 3, label: "Цвет" },
        ]},
        { id: "c", name: "c", label: "Место нанесения", type: "select", defaultValue: 1, options: [
          { value: 1, label: "Запястье" },
          { value: 1.2, label: "Предплечье" },
          { value: 1.3, label: "Плечо" },
          { value: 1.5, label: "Спина" },
        ]},
      ],
      formula: "(a * 500 * b * c)",
      currency: "₽",
    }
  }
}

// GET - Retrieve master profile config
export async function GET(request: Request) {
  // In production, get artistId from auth session
  const artistId = "1"
  
  const profile = masterProfiles[artistId]
  
  if (!profile) {
    return NextResponse.json(
      { error: "Profile not found" },
      { status: 404 }
    )
  }

  return NextResponse.json(profile)
}

// PUT - Update master profile config
export async function PUT(request: Request) {
  // In production, get artistId from auth session
  const artistId = "1"
  
  try {
    const body: MasterProfileConfig = await request.json()
    
    // Validate the config
    if (!body.bio || !body.tags || !body.sections || !body.calculatorConfig) {
      return NextResponse.json(
        { error: "Invalid profile config" },
        { status: 400 }
      )
    }
    
    // Store the config (in production, save to database)
    masterProfiles[artistId] = body
    
    return NextResponse.json({ 
      success: true, 
      message: "Profile updated successfully",
      profile: body 
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    )
  }
}

// PATCH - Partially update master profile config
export async function PATCH(request: Request) {
  // In production, get artistId from auth session
  const artistId = "1"
  
  try {
    const body: Partial<MasterProfileConfig> = await request.json()
    
    const existingProfile = masterProfiles[artistId]
    
    if (!existingProfile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      )
    }
    
    // Merge with existing config
    masterProfiles[artistId] = {
      ...existingProfile,
      ...body,
      sections: {
        ...existingProfile.sections,
        ...(body.sections || {}),
      },
      calculatorConfig: {
        ...existingProfile.calculatorConfig,
        ...(body.calculatorConfig || {}),
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      message: "Profile updated successfully",
      profile: masterProfiles[artistId]
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    )
  }
}
