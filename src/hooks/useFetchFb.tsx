import { db } from "@/utils/firebase";
import { doc, getDoc, collection, getDocs, CollectionReference, DocumentData } from "firebase/firestore";
import React from "react";

interface worksheetData {
  createdAt: string;
  gradeLevel: string;
  isPaid: boolean;
  publicUrl: string;
  subtitle: string;
  tags: Array<string>;
  title: string;
  topicName: string;
}

const useFetch = (gradeName: string): { loading: boolean; data: Array<worksheetData> } => {
  const docRef: CollectionReference<DocumentData, DocumentData> = collection(db, gradeName);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [data, setData] = React.useState<Array<worksheetData>>([]);

  const getData = async () => {
    setLoading(true);
    const querySnapshot = await getDocs(docRef);

    let queryData: Array<worksheetData> = [];
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${doc.data()}`);
      queryData = [...queryData, ...doc.data().worksheetData];
    });
    setLoading(false);
    setData(queryData);
  };

  React.useEffect(() => {
    getData();
  }, [gradeName]);

  return { loading, data };
};

export { useFetch };
