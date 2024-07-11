/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
// @ts-nocheck

import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
    try {

        const { searchParams } = new URL(request.url);

        const hasTitle = searchParams.has("title");
        const title = hasTitle ? searchParams.get("title")?.slice(0, 100) : "InternVista";

        const fontData = await fetch(new URL("../../../../assets/fonts/Inter-Bold.ttf", import.meta.url)).then((res) => res.arrayBuffer());

        const imageData = await fetch(new URL("../../../../assets/logo-192x192.png", import.meta.url)).then((res) => res.arrayBuffer());

        return new ImageResponse(
            (
                <div tw="flex flex-col w-full h-full items-center justify-center bg-white">
                    <div tw="bg-gray-50 flex w-full">
                        <img width={192} height={192} src={imageData} />
                        <div tw="flex flex-col md:flex-row w-full py-12 px-4 md:items-center justify-between p-8">
                            <h2 tw="flex flex-col text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 text-left">
                                <span tw="text-orange-500">{title}</span>
                                <span style={{ fontFamily: "Inter" }}>Ready to dive in?</span>
                                <span tw="text-orange-500">Get your first Internship Now.</span>
                            </h2>
                            <div tw="mt-8 flex md:mt-0">
                                <div tw="flex rounded-md shadow">
                                    <a tw="flex items-center justify-center rounded-md border border-transparent bg-orange-500 px-5 py-3 text-base font-medium text-white">Join Now</a>
                                </div>
                                <div tw="ml-3 flex rounded-md shadow">
                                    <a tw="flex items-center justify-center rounded-md border border-transparent bg-white px-5 py-3 text-base font-medium text-orange-500">Learn more</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ),
            {
                fonts: [{
                    name: 'Inter',
                    data: fontData,
                    style: 'normal'
                }]
            }
        )
    } catch (e: any) {
        return new Response("Failed to get image", { status: 500 });
    }
}