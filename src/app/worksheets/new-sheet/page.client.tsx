"use client";

import React, { useState } from "react";

import { useFormik } from "formik";
import * as yup from "yup";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { auth } from "@/utils/firebase";

export default function NewSheetClient() {
  const validationSchema = yup.object({
    title: yup.string().required("Title is required"),
    subtitle: yup.string().required("Subtitle is required"),
    gradeLevel: yup.string().required("Grade level is required"),
    topicName: yup.string().required("Topic name is required"),
    tags: yup.array().min(1, "At least one tag is required"),
  });

  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const formik = useFormik({
    initialValues: {
      title: "",
      subtitle: "",
      gradeLevel: "",
      topicName: "",
      isPaid: false,
      tags: [],
    },
    validationSchema,
    onSubmit: (values) => {
      console.log("Form Data:", { ...values, tags, image });
    },
  });

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput)) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
      formik.setFieldValue("tags", [...tags, tagInput.trim()]);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setImage(event.target.files[0]);
    }
  };

  const uploadImage = async (file: File, grade: string, topicName: string) => {
    try {
      const user = auth.currentUser;
      const idToken = await user?.getIdToken(true);

      const fileName = `${Date.now()}_${file.name}`;
      const filePath = `${grade}/${topicName}/${fileName}`;

      if (idToken) {
        const { data, error } = await supabase.storage.from("images").upload(filePath, file, { upsert: false });
        console.log("the uploadImage data =>", data);

        if (error) {
          console.error("Error uploading image:", error);
          return null;
        }

        const { data: dataToGetPublicUrl } = supabase.storage.from("images").getPublicUrl(filePath);

        if (dataToGetPublicUrl.publicUrl) {
          console.log("Error getting public URL:", dataToGetPublicUrl.publicUrl);
          // return null;
        }
      }
    } catch (error) {
      console.log("the error found while uploading image to supabase =>", error);
    }
  };

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="w-5/6 mx-auto bg-white border-2 border-gray-200
    rounded-lg shadow-md space-y-4 mt-10 p-5"
    >
      {/* Title */}
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          placeholder="Enter worksheet title"
          onChange={formik.handleChange}
          value={formik.values.title}
        />
        {formik.touched.title && formik.errors.title ? (
          <p className="text-red-500 text-sm">{formik.errors.title}</p>
        ) : null}
      </div>

      {/* Subtitle */}
      <div>
        <Label htmlFor="subtitle">Subtitle</Label>
        <Input
          id="subtitle"
          name="subtitle"
          placeholder="Enter worksheet subtitle"
          onChange={formik.handleChange}
          value={formik.values.subtitle}
        />
        {formik.touched.subtitle && formik.errors.subtitle ? (
          <p className="text-red-500 text-sm">{formik.errors.subtitle}</p>
        ) : null}
      </div>

      {/* Tags Input & Button */}
      <div>
        <Label htmlFor="tags">Tags</Label>
        <div className="flex gap-2">
          <Input id="tags" placeholder="Enter a tag" value={tagInput} onChange={(e) => setTagInput(e.target.value)} />
          <Button
            type="button"
            onClick={() => {
              // addTag();
              if (image) {
                console.log("ready to upload image to supabase !!!");
                uploadImage(image, "kindergarten", "numbers");
              }
            }}
            className="px-3"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
        {/* Display Tags */}
        <div className="flex flex-wrap gap-2 mt-5">
          {tags.map((tag, index) => (
            <div key={index} className="bg-yellow-400 px-5 h-12 flex items-center rounded-md">
              {tag}
            </div>
          ))}
        </div>
        {formik.errors.tags ? <p className="text-red-500 text-sm">{formik.errors.tags}</p> : null}
      </div>

      {/* Grade Level */}
      <div>
        <Label htmlFor="gradeLevel">Grade Level</Label>
        <Input
          id="gradeLevel"
          name="gradeLevel"
          placeholder="Enter grade level (e.g., Grade 3)"
          onChange={formik.handleChange}
          value={formik.values.gradeLevel}
        />
        {formik.touched.gradeLevel && formik.errors.gradeLevel ? (
          <p className="text-red-500 text-sm">{formik.errors.gradeLevel}</p>
        ) : null}
      </div>

      {/* Topic Name */}
      <div>
        <Label htmlFor="topicName">Topic Name</Label>
        <Input
          id="topicName"
          name="topicName"
          placeholder="Enter topic name (e.g., Addition)"
          onChange={formik.handleChange}
          value={formik.values.topicName}
        />
        {formik.touched.topicName && formik.errors.topicName ? (
          <p className="text-red-500 text-sm">{formik.errors.topicName}</p>
        ) : null}
      </div>

      {/* Free/Paid Switch */}
      <div className="flex items-center gap-2">
        <Label>Free / Paid</Label>
        <Switch checked={formik.values.isPaid} onCheckedChange={(checked) => formik.setFieldValue("isPaid", checked)} />
      </div>

      {/* Image Upload */}
      <div className="">
        <Label htmlFor="image">Upload Worksheet Image</Label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="border border-gray-200"
        />
        {image && <p className="text-sm text-green-500">Selected: {image.name}</p>}
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full">
        Submit
      </Button>
    </form>
  );
}
