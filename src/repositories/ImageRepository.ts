import { Injectable } from "@nestjs/common";
import ImageInstance from "../models/ImageInstance";
import { Types } from "mongoose";

@Injectable()
export class ImageRepository {
  /**
   * Get use image with given user id.
   * @param objectId - User ObjectId.
   * @returns Returns image data object.
   */
  public async getUserImage(objectId: string): Promise<ImageInstance | null> {
    return await ImageInstance.findOne({
      user: new Types.ObjectId(objectId),
      imageType: "userImage",
    });
  }

  /**
   * Get product image with given product id.
   * @param objectId - Product ObjectId.
   * @returns Returns image data object.
   */
  public async getProductImage(
    objectId: string
  ): Promise<ImageInstance | null> {
    return await ImageInstance.findOne({
      product: new Types.ObjectId(objectId),
      imageType: "productImage",
    });
  }

  /**
     *Create a image with given image buffer, user id and image name.
     *@param objectId - User ObjectId.
     *@param imageData - data containg image file buffer and image type. 
     imageType should be productImage or userImage.
     */
  public async createImage(
    objectId: string,
    { imageType, data }: ImageInstanceDTO
  ): Promise<void> {
    await ImageInstance.create({
      user: objectId,
      imageType,
      data,
      imageName: `${objectId}`,
    });
  }

  /**
   * Update or create a user image with given id and image file
   *@param objectId - ImageInstance ObjectId.
   *@param imageData - data containg image file buffer and image type.
   */
  public async updateImage(
    objectId: string,
    imageData: ImageInstanceDTO
  ): Promise<void> {
    await ImageInstance.findByIdAndUpdate(objectId, imageData);
  }
}
