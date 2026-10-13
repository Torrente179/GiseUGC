import Foundation
import Vision
import CoreImage
import CoreImage.CIFilterBuiltins
import ImageIO
import UniformTypeIdentifiers

// Subject cut-out for the home hero, via Apple Vision (macOS 14+).
// usage: swift scripts/hero-cutout.swift <original.jpg> <raw-cutout.png>
// Then clean the edges and export sizes with scripts/clean-hero-cutout.py.
let args = CommandLine.arguments
let inURL = URL(fileURLWithPath: args[1])
let outURL = URL(fileURLWithPath: args[2])

guard let input = CIImage(contentsOf: inURL) else { fatalError("cannot read input") }
let handler = VNImageRequestHandler(ciImage: input)
let request = VNGenerateForegroundInstanceMaskRequest()
try handler.perform([request])
guard let result = request.results?.first else { fatalError("no subject found") }

let maskBuffer = try result.generateScaledMaskForImage(forInstances: result.allInstances, from: handler)
let mask = CIImage(cvPixelBuffer: maskBuffer)

let blend = CIFilter.blendWithMask()
blend.inputImage = input
blend.backgroundImage = CIImage.empty()
blend.maskImage = mask
guard let output = blend.outputImage else { fatalError("blend failed") }

let ctx = CIContext()
guard let cg = ctx.createCGImage(output, from: input.extent) else { fatalError("render failed") }
guard let dest = CGImageDestinationCreateWithURL(outURL as CFURL, UTType.png.identifier as CFString, 1, nil) else { fatalError("dest failed") }
CGImageDestinationAddImage(dest, cg, nil)
CGImageDestinationFinalize(dest)
print("ok \(cg.width)x\(cg.height)")
