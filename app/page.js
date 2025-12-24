import NotesClient from "@/components/NotesClient";
import dbConnect from "@/lib/db";
import Image from "next/image";
import Note from "@/models/Note";
async function getNotes(){
    await dbConnect();
    const notes = await Note.find({}).sort({createdAt:-1, _id:-1}).lean();
    return notes.map((note)=>{
        return {
            ...note,
            _id: note._id.toString()
        }
    })
}
export default async function Home() {
  const notes = await getNotes();
  console.log(notes);
  return (
    <>

      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Notes App</h1>
        <NotesClient initialNotes={notes}/>
      </div>
    
    
    </>
  );
}

/*
Before using lean()
Connected to mongodb
[
  {
    '$__': InternalCache { activePaths: [ctor], skipId: true },
    '$isNew': false,
    _doc: {
      _id: new ObjectId('6948d8f035a588adcab424fe'),
      title: 'Learn LLD',
      content: 'Low Level Design',
      createdAt: 2025-12-22T05:36:49.024Z,
      updatedAt: 2025-12-22T05:36:49.024Z,
      __v: 0
    },
    _id: '6948d8f035a588adcab424fe'
  }
]

after using lean()
Connected to mongodb
[
  {
    _id: '6948d8f035a588adcab424fe',
    title: 'Learn LLD',
    content: 'Low Level Design',
    createdAt: 2025-12-22T05:36:49.024Z,
    updatedAt: 2025-12-22T05:36:49.024Z,
    __v: 0
  }
]

*/