import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default cloudinary

// Helper function to upload image from File
export async function uploadImageFromFile(file: File, folder: string = 'votehubph'): Promise<any> {
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: 'image',
        transformation: [
          { width: 800, height: 800, crop: 'limit' },
          { quality: 'auto' },
          { fetch_format: 'auto' }
        ]
      },
      (error, result) => {
        if (error) reject(error)
        else resolve(result)
      }
    ).end(buffer)
  })
}

// Helper function to upload image from URL
export async function uploadImageFromUrl(url: string, folder: string = 'votehubph'): Promise<any> {
  return await cloudinary.uploader.upload(url, {
    folder: folder,
    transformation: [
      { width: 800, height: 800, crop: 'limit' },
      { quality: 'auto' },
      { fetch_format: 'auto' }
    ]
  })
}

// Helper function to delete image
export async function deleteImage(publicId: string): Promise<any> {
  return await cloudinary.uploader.destroy(publicId)
}

// Helper to get optimized image URL
export function getOptimizedImageUrl(publicId: string, width: number = 400, height: number = 400): string {
  return cloudinary.url(publicId, {
    width,
    height,
    crop: 'fill',
    quality: 'auto',
    fetch_format: 'auto'
  })
}
