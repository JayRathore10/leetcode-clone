import {  useParams } from "react-router-dom";
import "../styles/Submission.css";
import { useEffect } from "react";
import axios from "axios";
import { env } from "../configs/env.config";
export function Submission(){

  const {id} = useParams<{id : string}>();

  useEffect(()=>{
    const fetchSubmissionDetails = async ()=>{
      const response = await axios.get(`${env.backendUrl}/api/submission/${id}`);
      console.log(response.data);
    }
    fetchSubmissionDetails();
  } , [id]);

  return(
    <>
      <p>
        {id}
      </p>
    </>
  );
}