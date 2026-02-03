import {  useParams } from "react-router-dom";
import "../styles/Submission.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { env } from "../configs/env.config";
import { Submission as SubmissionType } from "./Profile";

export function Submission(){

  const {id} = useParams<{id : string}>();
  const [submission , setSubmission] = useState<SubmissionType>();

  useEffect(()=>{
    const fetchSubmissionDetails = async ()=>{
      const response = await axios.get(`${env.backendUrl}/api/submission/${id}`);
      console.log(response.data);
      setSubmission(response.data.code);
    }
    fetchSubmissionDetails();
  } , [id]);

  return(
    <>
      <p>
        {submission?.code}
      </p>
    </>
  );
}