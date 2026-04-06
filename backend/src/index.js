import express from "express";
import cors from "cors";
import {PrimaClient} from "@prisma/client";

const PORT = Number(process.env.PORT || 5000);

app.use(cors());
app.use(express.json());

app.get("/", async (req:Request, res:Response))