import type { NextApiRequest , NextApiHandler, NextApiResponse } from "next";
import { signUp } from "../lib/firebase/service";

export default function handler(req : NextApiRequest , res : NextApiResponse) {
    res.status(200).json({status : true , message : 'success '});
}