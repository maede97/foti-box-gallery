import Image from 'next/image';

export default async function GalleryPage({ params }: { params: { uuid: string } }) {
  const { uuid } = await params;
  if (uuid == undefined) {
    throw Error('uuid undefined');
  }
  return (
    <div>
      <h1>Photo</h1>
      <Image src={`/api/gallery?uuid=${uuid}`} alt="Photo" />
    </div>
  );
}
