/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PROVINCES_GEO_MAPPING } from '@/config/province'

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  date: z.string().min(1, 'Date is required'),
  summary: z.string().min(10, 'Summary must be at least 10 characters'),
  provinceId: z.string().min(1, 'Province is required'),
  images: z.any(),
  videos: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export function AddTripForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      date: '',
      summary: '',
      provinceId: '',
      images: undefined,
      videos: '',
    },
  })

  function onSubmit(values: FormValues) {
    // Convert FileList to array of Files
    const images = values.images ? Array.from(values.images) : []

    console.log({
      ...values,
      images: images.map(file => ({
        name: (file as any)?.name,
        size: (file as any)?.size,
        type: (file as any)?.type,
      })),
    })

    // To upload files, you would typically:
    // 1. Create FormData
    // 2. Append all fields and files
    // 3. Send to API endpoint

    // Example:
    // const formData = new FormData()
    // formData.append('title', values.title)
    // formData.append('date', values.date)
    // ... etc
    // images.forEach((file, index) => {
    //   formData.append(`images[${index}]`, file)
    // })

    // TODO: Handle form submission
  }

  const provinces = Object.entries(PROVINCES_GEO_MAPPING).map(([id, name]) => ({
    id,
    name,
  }))

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter trip title" {...field} />
              </FormControl>
              <FormDescription>
                Give your trip a memorable title
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormDescription>When did this trip take place?</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="provinceId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Province</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a province" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {provinces.map(province => (
                    <SelectItem key={province.id} value={province.id}>
                      {province?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>Which province did you visit?</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="summary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Summary</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your trip..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Share your experience and highlights
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="images"
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem>
              <FormLabel>Images</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={event => onChange(event.target.files)}
                  {...fieldProps}
                />
              </FormControl>
              <FormDescription>
                Select one or more images for your trip
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="videos"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Videos</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter video URLs (one per line)"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Add video URLs, separated by new lines
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button type="submit" className="flex-1">
            Create Trip
          </Button>
          <Button type="button" variant="outline" className="flex-1">
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  )
}
