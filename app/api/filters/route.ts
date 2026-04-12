import { NextRequest, NextResponse } from "next/server"
import { 
  mastersFiltersConfig, 
  servicesFiltersConfig, 
  productsFiltersConfig 
} from "@/lib/filters-config"

// GET /api/filters?type=masters|services|products
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const type = searchParams.get("type")

  // In production, this would fetch from database
  // Example: const config = await db.filtersConfig.findUnique({ where: { type } })

  let config
  switch (type) {
    case "masters":
      config = mastersFiltersConfig
      break
    case "services":
      config = servicesFiltersConfig
      break
    case "products":
      config = productsFiltersConfig
      break
    default:
      return NextResponse.json(
        { error: "Invalid filter type. Use: masters, services, or products" },
        { status: 400 }
      )
  }

  return NextResponse.json(config)
}

// POST /api/filters - For admin to update filter configurations
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, config } = body

    if (!type || !config) {
      return NextResponse.json(
        { error: "Missing required fields: type and config" },
        { status: 400 }
      )
    }

    // In production, this would save to database
    // Example: await db.filtersConfig.upsert({
    //   where: { type },
    //   update: { config },
    //   create: { type, config }
    // })

    // For now, just return success
    return NextResponse.json({ 
      success: true, 
      message: `Filters config for '${type}' would be saved to database`,
      // Return the config that would be saved
      savedConfig: {
        type,
        config,
        updatedAt: new Date().toISOString()
      }
    })
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    )
  }
}
