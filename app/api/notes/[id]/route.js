import dbConnect from "@/lib/db";
import { NextResponse } from "next/server";
import Note from "@/models/Note";
export async function DELETE(request, {params}){
    try {
        await dbConnect();
        const {id} = await params;
        const deletedNote = await Note.findByIdAndDelete(id);
        if(!deletedNote){
            return NextResponse.json({
                success:false,
                error: "No note exists with given id"
            }, {status:404})
        }
        return NextResponse.json({
            success:true,
            message: "Note Deleted successfully",
            data: deletedNote
        }, {status: 200});
    } catch (error) {
        return NextResponse.json({
            success:false,
            error:error.message
        }, {status:500})
    }
}

export async function PUT(request, {params}){
    try {
        await dbConnect();
        const {id} = await params;
        const body = await request.json();
        const updatedNote = await Note.findByIdAndUpdate(id, body, {new:true, runValidators:true});

        if(!updatedNote){
            return NextResponse.json({
                success:false,
                error:"Note not found"
            }, {status:404})
        }

        return NextResponse.json({
            success:true,
            data:updatedNote,
        }, {status:200});
    } catch (error) {
        return NextResponse.json({
            success:false,
            error:error.message
        }, {status:500})
    }
}