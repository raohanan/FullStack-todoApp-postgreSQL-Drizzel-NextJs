import { QueryResult } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";
import { Todo, NewTodo, db, todoTable } from "@/lib/drizzle";
import { sql } from "@vercel/postgres";

export async function GET(request: NextRequest) {
  try {
    await sql`CREATE TABLE IF NOT EXISTS Todo(id serial , Task varchar(255))`;

    const res = await db.select().from(todoTable);
    // console.log(res.rows.find((item)=> item.id ===1));
    return NextResponse.json({ data: res });
  } catch (err) {
    console.log((err as { message: string }).message);
    return NextResponse.json({ message: "sommething went wrong" });
  }
}
 
export async function POST(request: NextRequest) {
  const req = await request.json();
  try {
    if (req.task) {
      const res = await db
        .insert(todoTable)
        .values({
          task: req.task,
        })
        .returning();
      console.log(res);
      return NextResponse.json({
        message: "Data added successfully",
        data: res,
      });
    } else {
      throw new Error("Task fir=eld is required");
    }
  } catch (error) {
    return NextResponse.json({
      message: (error as { message: string }).message,
    });
  }
}
// export async function GET(request: NextRequest) {
//   const client = await db.connect();

//   try {
//     await client.sql`CREATE TABLE IF NOT EXISTS Todo(id serial , Task varchar(255))`;
//     const res = await client.sql`SELECT * FROM Todo`;
//     console.log(res);
//     return NextResponse.json({ data: res });
//   } catch (err) {
//     console.log(err);
//     return NextResponse.json({ message: "sommething went wrong" });
//   }
// }

// export async function POST(request: NextRequest) {
//   const client = await db.connect();
//   const req = await request.json();
//   try {
//     if (req.task) {
//       const res = await client.sql`INSERT INTO Todo(Task) VALUES(${req.task})`;
//       console.log(res);
//       return NextResponse.json({ message: "Data added successfully" });
//     } else {
//       throw new Error("Task fir=eld is required");
//     }
//   } catch (error) {
//     return NextResponse.json({
//       message: (error as { message: string }).message,
//     });
//   }
// }
