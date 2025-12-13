# foti-box

<p align="center">
  <img src="public/foti-box.png" width="350" title="hover text">
</p>

A small web-gui for my custom photobooth (consisting of a box with a Nikon camera and a Raspberry Pi controlling it).

Visit [foti-box.com](https://foti-box.com)!

## Software

- Typescript
- React
- Next
- pnpm package manager

## Developer Setup
```
cp env.example .env
docker compose up -d mongo mongo-express
bash create_build_info.sh
pnpm i
pnpm run dev
```

## Functionality

- Admin panel (add events, boxes, manage images)
- Upload panel (guests can upload their images)
- Gallery view (show all images for an event)
- Single Image view (show only uploaded images)
