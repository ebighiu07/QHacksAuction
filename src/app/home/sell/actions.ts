"use server"
import { Params } from './../../../../node_modules/aws-sdk/lib/s3/presigned_post.d';
import aws from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
const region = 'us-east-2';
const bucketName = 'qhacks-2025-s3';
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3 = new aws.S3({
  region,
  accessKeyId,
  secretAccessKey,
});

export async function generateUploadURL() {
    const id = uuidv4();

    const params = ({
        Bucket: bucketName,
        Key: `${id}.jpg`,
        Expires: 60,
    });

    const uploadURL = await s3.getSignedUrlPromise('putObject', params);
    return uploadURL;
}



import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function generateMetadata(imageUrl: string) {
  try {
    // Send the image to OpenAI's API for analysis
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "What's the subject of this product image?" },
            {
              type: "image_url",
              image_url: { url: imageUrl },
            },
          ],
        },
      ],
      store: true, // Store the conversation for potential follow-ups
    });

    // Extract the response describing the image
    const description = response.choices[0]?.message?.content;

    if (!description) {
      throw new Error("Failed to generate a description from the image.");
    }

    // Generate metadata based on the description
    const titleResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `Generate an eBay listing title for an item described as: "${description}". Don't describe the environment, just the subject object. Write only a couple specific words.`, 
        },
      ],
      store: true,
    });

    const priceResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: `Generate a price for an item described as: "${description}". Give the number integer value only to the nearest 5.`,
          }
        ],
        store: true,
      });

    // Extract the generated metadata
    const metadata = {
        title: titleResponse.choices[0]?.message?.content,
        price: priceResponse.choices[0]?.message?.content ? parseInt(priceResponse.choices[0].message.content.replace(/\D/g, ''), 10) : 0,
    };
    if (!metadata) {
      throw new Error("Failed to generate metadata.");
    }

    return metadata;
  } catch (error) {
    console.error("Error generating metadata:", error);
    throw error;
  }
}



