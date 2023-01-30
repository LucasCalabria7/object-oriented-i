import express, { Request, Response } from 'express'
import cors from 'cors'
import { db } from './database/knex'
import { Videos } from './models/videos'

const app = express()

app.use(cors())
app.use(express.json())

app.listen(3003, () => {
    console.log(`Servidor rodando na porta ${3003}`)
})

app.get("/ping", async (req: Request, res: Response) => {
    try {
        res.status(200).send({ message: "Pong!" })
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})


//SearchVideo
app.get("/videos", async (req: Request, res: Response) => {
    try {
        const q = req.query.q

        let videosDB

        if (q) {
            const result = await db("videos").where("title", "LIKE", `%${q}%`)
            videosDB = result
        } else {
            const result = await db("videos")
            videosDB = result
        }

        const video: Videos[] = videosDB.map((videoDB)=> 
        new Videos(
            videoDB.id,
            videoDB.title,
            videoDB.duration,
            videoDB.created_at
        ))

        res.status(200).send(video)
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

//CreateVideo
app.post("/videos", async (req: Request, res: Response) => {
    try {
        const { id, title, duration } = req.body

        if (typeof id !== "string") {
            res.status(400)
            throw new Error("'id' deve ser string")
        }

        if (typeof title !== "string") {
            res.status(400)
            throw new Error("'name' deve ser string")
        }

        if (typeof duration !== "number") {
            res.status(400)
            throw new Error("'email' deve ser string")
        }

        const [ videoExists ] = await db("videos").where({ id })

        if (videoExists) {
            res.status(400)
            throw new Error("'id' já existe")
        }

        const newVideo = new Videos(
            id,
            title,
            duration,
            new Date().toISOString()
        )

        const newVideoDB = {
            id: newVideo.getId(),
            title: newVideo.getTitle(),
            duration: newVideo.getDuration(),
            created_at: newVideo.getCreatedAt(),
        }

        await db("videos").insert(newVideoDB)
        const [ videoDB ] = await db("videos").where({ id })

        res.status(201).send(videoDB)
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

//EditVideo
app.put("/videos/:id", async (req: Request, res: Response) => {
    try {
        const idToEdit = req.params.id

        const newId = req.body.id
        const newTitle = req.body.title
        const newDuration = req.body.duration

        if (typeof idToEdit !== "string") {
            res.status(400)
            throw new Error("'id' deve ser string")
        }

        if (typeof newTitle !== "string") {
            res.status(400)
            throw new Error("'Title' deve ser string")
        }

        if (typeof newDuration !== "number") {
            res.status(400)
            throw new Error("'Duration' deve ser string")
        }

        const [ video ] = await db("videos").where({ id: idToEdit })

        const newVideo = new Videos(
            newId,
            newTitle,
            newDuration,
            new Date().toISOString()
        )

        const newVideoDB = {
            id: newVideo.getId(),
            title: newVideo.getTitle(),
            duration: newVideo.getDuration(),
            created_at: newVideo.getCreatedAt(),
        }

        if (video) {
            const updatedVideo = {
                id: newVideoDB.id || video.id,
                title: newVideoDB.title || video.title ,
                duration: newVideoDB.duration || video.duration,
                created_at: newVideo.getCreatedAt() || video.created_at
            }
                await db("videos")
                .update(updatedVideo)
                .where({ id: idToEdit })
        } else {
            res.status(404)
            throw new Error("Invalid ID, try again!")
        }

        res.status(201).send("Video updated successfully")
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

//DeleteVideo
app.delete("/videos/:id", async (req: Request, res: Response) => {
    try {
        const idToDelete = req.params.id

        if (typeof idToDelete !== "string") {
            res.status(400)
            throw new Error("'id' deve ser string")
        }

        const [ videoExists ] = await db("videos").where({ id: idToDelete })

        if (videoExists) {
                await db("videos")
                .del()
                .where({ id: idToDelete })
        } else {
            res.status(404)
            throw new Error("Invalid ID, try again!")
        }

        res.status(201).send("Video deleted successfully")
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})
