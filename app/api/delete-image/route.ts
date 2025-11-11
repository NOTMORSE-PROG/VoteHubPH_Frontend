import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

/**
 * Delete image from Cloudinary by public_id or URL
 */
export async function POST(request: NextRequest) {
  try {
    const { publicId, url } = await request.json()

    if (!publicId && !url) {
      return NextResponse.json({ error: 'publicId or url is required' }, { status: 400 })
    }

    let imagePublicId = publicId

    // If URL is provided, extract public_id from it
    if (!imagePublicId && url) {
      // Extract public_id from Cloudinary URL
      // Format: https://res.cloudinary.com/{cloud_name}/image/upload/{transformations}/{public_id}.{format}
      const urlMatch = url.match(/\/upload\/[^\/]+\/(.+)\.(jpg|jpeg|png|gif|webp)/i)
      if (urlMatch) {
        // Remove any transformations and get the public_id
        const pathParts = urlMatch[1].split('/')
        // Get the last part which should be the public_id
        imagePublicId = pathParts[pathParts.length - 1]
        // If it's in a folder, reconstruct the full path
        if (pathParts.length > 1) {
          imagePublicId = pathParts.slice(0, -1).join('/') + '/' + imagePublicId
        }
      } else {
        // Try to extract from simpler format
        const simpleMatch = url.match(/\/image\/upload\/(.+)/)
        if (simpleMatch) {
          const fullPath = simpleMatch[1]
          // Remove file extension
          imagePublicId = fullPath.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '')
        }
      }
    }

    if (!imagePublicId) {
      return NextResponse.json({ error: 'Could not extract public_id from URL' }, { status: 400 })
    }

    // Delete the image
    const result = await cloudinary.uploader.destroy(imagePublicId)

    if (result.result === 'ok' || result.result === 'not found') {
      return NextResponse.json({
        success: true,
        result: result.result,
        publicId: imagePublicId
      })
    } else {
      return NextResponse.json({
        success: false,
        error: 'Failed to delete image',
        result: result.result
      }, { status: 500 })
    }
  } catch (error: any) {
    console.error('Delete image error:', error)
    return NextResponse.json(
      { error: 'Failed to delete image', message: error.message },
      { status: 500 }
    )
  }
}

