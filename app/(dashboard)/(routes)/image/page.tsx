"use client";

import Empty from "@/components/empty";
import Heading from "@/components/heading";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectItem, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { SelectContent, SelectTrigger } from "@radix-ui/react-select";
import axios from "axios";
import { Download, Image as ImageLogo } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { amountOptions, formSchema, resolutionOptions } from "./constants";

const ImagePage = () => {

    const router = useRouter();
    const [images, setImages] = useState<string[]>([]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: "",
            amount: "1",
            resolution: "512x512"
        }
    })
    const isLoading = form.formState.isSubmitting;
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values);
        try {
            setImages([])
            const response = await axios.post("/api/image", values);
            const urls = response.data.map((image: { url: string }) => image.url);
            setImages(urls);

            form.reset();

        } catch (error) {
            // TODO: Open Pro Modal
            console.log(error);
        } finally {
            router.refresh();
        }
    };

    return (<div>
        <Heading
            title="Image generation"
            description="Trun you prompt into a image"
            icon={ImageLogo}
            iconColor="text-orange-700"
            bgColor="bg-orange-700/10"
        />
        <div className="px-4 lg:px-8">
            <div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}
                        className="rounded-lg
                        border
                        w-full
                        p-4
                        px-3
                        md:px-6
                        focus-within:shadow-sm
                        grid
                        grid-cols-12
                        gap-2
                        ">
                        <FormField name="prompt" render={({ field }) => (
                            <FormItem className="col-span-12 lg:col-span-6">
                                <FormControl className="m-0 p-0">
                                    <Input className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                                        disabled={isLoading}
                                        placeholder="Type your message here"
                                        {...field}
                                    />
                                </FormControl> 
                            </FormItem>
                        )} />
                        <FormField name="amount"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem className="col-span-12 lg:col-span-2">
                                    <Select disabled={isLoading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1">
                                                <SelectValue defaultValue={field.value} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-background border">
                                            {amountOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )} />
                        <FormField name="resolution"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem className="col-span-12 lg:col-span-2 ">
                                    <Select disabled={isLoading}
                                        onValueChange={field.onChange}
                                        value={field.value.toString()}
                                        defaultValue={field.value.toString()}

                                    >
                                        <FormControl>
                                            <SelectTrigger className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1">
                                                <SelectValue defaultValue={field.value} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-background border">
                                            {resolutionOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )} />
                        <Button className="col-span-12 lg:col-span-2 w-full">
                            Generate
                        </Button>
                    </form>
                </Form>
            </div>
            <div className="space-y-4 mt-4">
                {isLoading && (
                    <div className="p-20">
                        <Loader />
                    </div>
                )}

                {
                    images.length === 0 && !isLoading && (
                        <Empty label="No images generated" />
                    )
                }
                <div className="grid grid-cols-1 md-grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
                    {images.map((url, index) => (
                        <Card key={url} className="rounded-lg overflow-hidden">
                            <div className="relative aspect-square">
                                <Image
                                    fill
                                    alt={`image-${index}`}
                                    src={url}
                                />
                            </div>
                            <CardFooter className="p-2">
                                <Button
                                    onClick={() => window.open(url)}
                                    variant="secondary"
                                    className="w-full"
                                >
                                    <Download className="h-4 w-4 mr-2" />
                                    Download
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    </div>);
}

export default ImagePage;