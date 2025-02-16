"use client";

import React, { useRef, useState } from "react";

import { FormikErrors, useFormik } from "formik";
import * as yup from "yup";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { LoaderCircle, Plus, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { auth, db } from "@/utils/firebase";
import { useToast } from "@/hooks/use-toast";
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";

interface formItemsType {
  title: string;
  subtitle: string;
  gradeLevel: string;
  topicName: string;
  isPaid: boolean;
  imageFormik: string;
  tags: Array<string>;
}

export default function NewSheetClient() {
  const validationSchema = yup.object().shape({
    formItems: yup.array().of(
      yup.object().shape({
        title: yup.string().required("Title is required"),
        subtitle: yup.string().required("Subtitle is required"),
        gradeLevel: yup.string().required("Grade level is required"),
        topicName: yup.string().required("Topic name is required"),
        tags: yup.array().of(yup.string()).min(1, "At least one tag is required"),
        imageFormik: yup.string().required("You must provide an image of worksheet"),
        isPaid: yup.bool(),
      }),
    ),
  });

  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [image, setImage] = useState<Array<File | null>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const { toast } = useToast();

  const formik = useFormik({
    initialValues: {
      formItems: [
        {
          title: "",
          subtitle: "",
          gradeLevel: "",
          topicName: "",
          isPaid: false,
          imageFormik: "",
          tags: [],
        },
      ] as Array<formItemsType>,
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);

      for (let form_ind = 0; form_ind < values.formItems.length; ++form_ind) {
        const form_item = values.formItems[form_ind];

        const imageFile = image[form_ind] as File;

        if (imageFile) {
          await uploadImage(imageFile, form_item);
        }
      }

      setIsLoading(false);

      toast({
        title: "Wittyworkbooks",
        description: `Added worksheets to database`,
      });
    },
  });

  const updateWorksheetToFb = async (publicUrl: string, form_item: formItemsType) => {
    const docRef = doc(db, form_item.gradeLevel, form_item.topicName);

    const data = await getDoc(docRef);
    if (!data.exists()) {
      await setDoc(docRef, {
        worksheetData: [
          {
            title: form_item.title,
            subtitle: form_item.subtitle,
            gradeLevel: form_item.gradeLevel,
            topicName: form_item.topicName,
            isPaid: form_item.isPaid,
            tags: form_item.tags,
            publicUrl,
            createdAt: new Date().toISOString(),
          },
        ],
      });
    } else {
      await updateDoc(docRef, {
        worksheetData: [
          ...data.get("worksheetData"),
          {
            title: form_item.title,
            subtitle: form_item.subtitle,
            gradeLevel: form_item.gradeLevel,
            topicName: form_item.topicName,
            isPaid: form_item.isPaid,
            tags: form_item.tags,
            publicUrl,
          },
        ],
      });
    }
  };

  const addTag = (__index: number) => {
    if (tagInput.trim() && !tags.includes(tagInput)) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
      formik.setFieldValue(`formItems[${__index}].tags`, [
        ...(formik.values.formItems[__index].tags || []),
        tagInput.trim(),
      ]);
    }
  };

  const removeTag = (form_index_no: number, index: number) => {
    const arrayWithItemsExceptToBeRemoved = formik.values.formItems[form_index_no].tags.filter(
      (_, ind) => ind != index,
    );

    formik.setFieldValue(`formItems[${form_index_no}].tags`, arrayWithItemsExceptToBeRemoved);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>, form_ind: number) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0] as File;

      setImage((prev) => [...prev, file]);

      formik.setFieldValue(`formItems[${form_ind}].imageFormik`, event.target.files[0].name);
    }
  };

  const uploadImage = async (file: File, form_item: formItemsType) => {
    try {
      const user = auth.currentUser;
      const idToken = await user?.getIdToken(true);

      const fileName = `${Date.now()}_${file.name}`;
      const filePath = `${form_item.gradeLevel}/${form_item.topicName}/${fileName}`;

      if (idToken) {
        const { data, error } = await supabase.storage.from("images").upload(filePath, file, { upsert: false });
        // console.log("the uploadImage data =>", data);

        if (error) {
          console.error("Error uploading image:", error);
          return null;
        }

        const { data: dataToGetPublicUrl } = supabase.storage.from("images").getPublicUrl(filePath);

        if (dataToGetPublicUrl.publicUrl) {
          // console.log("got public url:", dataToGetPublicUrl.publicUrl);

          await updateWorksheetToFb(dataToGetPublicUrl.publicUrl, form_item);
          // return null;
        }
      }
    } catch (error) {
      console.log("the error found while uploading image to supabase =>", error);
    }
  };

  const resetState = (index: number) => {
    const tempArr = formik.values.formItems.map((form_item, ind) => {
      return ind === index
        ? { title: "", subtitle: "", gradeLevel: "", topicName: "", isPaid: false, imageFormik: "", tags: [] }
        : form_item;
    });

    // console.log("the temp arr is =>", tempArr);
    formik.setFieldValue("formItems", tempArr);

    setTags([]);
    setImage((prev) =>
      prev.map((item, ind) => {
        if (ind == index) {
          return null;
        }
        return item;
      }),
    );

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const addNewWorksheetItem = () => {
    formik.setFieldValue("formItems", [
      ...formik.values.formItems,
      {
        title: "",
        subtitle: "",
        gradeLevel: "",
        topicName: "",
        isPaid: false,
        imageFormik: "",
        tags: [],
      } as formItemsType,
    ]);
  };

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="w-5/6 mx-auto bg-white border-2 border-gray-200
      rounded-lg shadow-md mt-10 p-5"
    >
      {formik.values.formItems.map((form_item, form_ind) => {
        return (
          <div className="w-full space-y-4 mb-5" key={`form_item${form_ind}`}>
            <div className="w-full h-10 flex justify-end">
              <Button
                onClick={() => {
                  resetState(form_ind);
                }}
                variant={"destructive"}
              >
                Reset
              </Button>
            </div>

            {/* Title */}
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter worksheet title"
                onChange={(ev) => {
                  formik.setFieldValue(`formItems[${form_ind}].title`, ev.target.value);
                }}
                value={form_item.title}
              />
              {formik.touched?.formItems?.[form_ind]?.title &&
              (formik.errors?.formItems?.[form_ind] as FormikErrors<formItemsType>)?.title ? (
                <p className="text-red-500 text-sm">
                  {(formik.errors?.formItems?.[form_ind] as FormikErrors<formItemsType>)?.title}
                </p>
              ) : null}
            </div>

            {/* Subtitle */}
            <div>
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                name="subtitle"
                placeholder="Enter worksheet subtitle"
                onChange={(ev) => {
                  formik.setFieldValue(`formItems[${form_ind}].subtitle`, ev.target.value);
                }}
                value={form_item.subtitle}
              />
              {formik.touched?.formItems?.[form_ind]?.subtitle &&
              (formik.errors?.formItems?.[form_ind] as FormikErrors<formItemsType>)?.subtitle ? (
                <p className="text-red-500 text-sm">
                  {(formik.errors?.formItems?.[form_ind] as FormikErrors<formItemsType>)?.subtitle}
                </p>
              ) : null}
            </div>

            {/* 1 Input & Button */}
            <div>
              <Label htmlFor="tags">Tags</Label>
              <div className="flex gap-2">
                <Input
                  id="tags"
                  placeholder="Enter a tag"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                />
                <Button
                  type="button"
                  onClick={() => {
                    addTag(form_ind);
                  }}
                  className="px-3"
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </div>
              {/* Display Tags */}
              <div className="flex flex-wrap gap-2 mt-5">
                {form_item?.tags?.map((tag, index) => (
                  <div
                    key={index}
                    className="bg-yellow-400 px-5 h-10 flex 
                    items-center rounded-md relative"
                  >
                    <p className="font-normal text-sm text-black">{tag}</p>

                    <div
                      className="absolute bg-black h-6 w-6 rounded-full flex items-center
                      justify-center top-[-10px] right-[-6px]
                    "
                      onClick={() => {
                        removeTag(form_ind, index);
                      }}
                    >
                      <Trash2 className="text-white h-[14px] w-[14px]" />
                    </div>
                  </div>
                ))}
              </div>
              {(formik.errors?.formItems?.[form_ind] as FormikErrors<formItemsType>)?.tags ? (
                <p className="text-red-500 text-sm">
                  {(formik.errors?.formItems?.[form_ind] as FormikErrors<formItemsType>)?.tags}
                </p>
              ) : null}
            </div>

            {/* Grade Level */}
            <div>
              <Label htmlFor="gradeLevel">Grade Level</Label>
              <Input
                id="gradeLevel"
                name="gradeLevel"
                placeholder="Enter grade level (e.g., Grade 3)"
                onChange={(ev) => {
                  formik.setFieldValue(`formItems[${form_ind}].gradeLevel`, ev.target.value);
                }}
                value={form_item.gradeLevel}
              />
              {(formik.errors?.formItems?.[form_ind] as FormikErrors<formItemsType>)?.gradeLevel ? (
                <p className="text-red-500 text-sm">
                  {(formik.errors?.formItems?.[form_ind] as FormikErrors<formItemsType>)?.gradeLevel}
                </p>
              ) : null}
            </div>

            {/* Topic Name */}
            <div>
              <Label htmlFor="topicName">Topic Name</Label>
              <Input
                id="topicName"
                name="topicName"
                placeholder="Enter topic name (e.g., Addition)"
                onChange={(ev) => {
                  formik.setFieldValue(`formItems[${form_ind}].topicName`, ev.target.value);
                }}
                value={form_item.topicName}
              />
              {formik.touched?.formItems?.[form_ind]?.topicName &&
              (formik.errors?.formItems?.[form_ind] as FormikErrors<formItemsType>)?.topicName ? (
                <p className="text-red-500 text-sm">
                  {(formik.errors?.formItems?.[form_ind] as FormikErrors<formItemsType>)?.topicName}
                </p>
              ) : null}
            </div>

            {/* Free/Paid Switch */}
            <div className="flex items-center gap-2">
              <Label>Free / Paid</Label>
              <Switch
                checked={form_item.isPaid}
                onCheckedChange={(checked) => formik.setFieldValue(`formItems[${form_ind}].isPaid`, checked)}
              />
            </div>

            {/* Image Upload */}
            <div className="">
              <Label htmlFor="image">Upload Worksheet Image</Label>
              <Input
                id="image"
                ref={imageInputRef}
                type="file"
                accept="image/*"
                onChange={(ev) => {
                  handleImageChange(ev, form_ind);
                }}
                className="border border-gray-200"
              />
              {formik.values.formItems[form_ind].imageFormik && (
                <p className="text-sm text-green-500">Selected: {formik.values.formItems[form_ind].imageFormik}</p>
              )}
              {(formik.errors?.formItems?.[form_ind] as FormikErrors<formItemsType>)?.imageFormik ? (
                <p className="text-red-500 text-sm">
                  {(formik.errors?.formItems?.[form_ind] as FormikErrors<formItemsType>)?.imageFormik}
                </p>
              ) : null}
            </div>
          </div>
        );
      })}

      <div className="w-full h-10 flex justify-end mb-5">
        <Button onClick={addNewWorksheetItem} variant={"secondary"}>
          <Plus className="w-5 h-5" />
          Add New
        </Button>
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full flex items-center justify-center" disabled={isLoading}>
        {isLoading ? <LoaderCircle className="mr-2 size-4 animate-spin" /> : "Submit"}
      </Button>
    </form>
  );
}
