'use client';

import { IBox } from '@/models/box';
import { IEvent } from '@/models/event';
import { IImage } from '@/models/image';
import { motion } from 'framer-motion';
import { ExternalLink, Plus, X } from 'lucide-react';
import { ObjectId } from 'mongoose';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

function Modal({ title, onClose, children }) {
  return (
    <div className="bg-primary/80 fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="bg-secondary text-primary relative w-full max-w-lg rounded-2xl p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-bold">{title}</h2>
        {children}
        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="bg-error hover:bg-error-dark text-secondary cursor-pointer rounded-xl px-4 py-2 font-semibold shadow-lg transition"
          >
            Schliessen
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [images, setImages] = useState<IImage[]>([]);
  const [imagesForEvent, setImagesForEvent] = useState<IEvent | undefined>();

  const [eventName, setEventName] = useState('');
  const [eventSlug, setEventSlug] = useState('');
  const [eventPassword, setEventPassword] = useState('');

  const [boxLabel, setBoxLabel] = useState('');
  const [boxAccessToken, setBoxAccessToken] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [token, setToken] = useState<string | undefined>(undefined);
  const [events, setEvents] = useState<IEvent[]>([]);
  const [boxes, setBoxes] = useState<IBox[]>([]);

  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showAddBox, setShowAddBox] = useState(false);
  const [showAddLogo, setShowAddLogo] = useState('');

  const [selectedLogo, setSelectedLogo] = useState<File | undefined>(undefined);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | undefined>(undefined);

  async function fetchEvents() {
    if (!token) return;
    const res = await fetch('/api/admin/events', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 401) {
      return handleLogout();
    }

    if (res.ok) {
      const data = await res.json();
      setEvents(data);
    }
  }

  async function switchActiveEvent(eventId: ObjectId) {
    if (!token) return;
    const res = await fetch('/api/admin/switch-event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ eventId }),
    });
    if (res.ok) fetchEvents();
  }

  async function handleAddEvent() {
    if (!eventName || !eventSlug) return setError('Name und Slug angeben.');

    const res = await fetch('/api/admin/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: eventName, slug: eventSlug, password: eventPassword }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Event kann nicht hinzugefügt werden.');
      return;
    }

    setEventName('');
    setEventSlug('');
    setEventPassword('');
    fetchEvents();
    setShowAddEvent(false);
  }

  async function handleDeleteEvent(eventID: ObjectId) {
    if (!confirm('Bist du sicher, dass du diesen Event löschen willst?')) return;

    const res = await fetch('/api/admin/events', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ eventID }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Der Event konnte nicht gelöscht werden.');
      return;
    }
    setImages(images.filter((img) => (img.event as unknown as ObjectId) !== eventID));
    setEvents(events.filter((event) => (event._id as unknown as ObjectId) !== eventID));
  }
  async function handleLogin() {
    setError('');
    if (!adminUsername || !adminPassword) return setError('Gib Benutzername und Passwort ein.');

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: adminUsername, password: adminPassword }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Login fehlgeschlagen');
      return;
    }

    const data = await res.json();
    localStorage.setItem('adminToken', data.token);
    setToken(data.token);
    setLoggedIn(true);
  }

  function handleLogout() {
    localStorage.removeItem('adminToken');
    setToken(undefined);
    setLoggedIn(false);
  }

  async function fetchImages(event: IEvent) {
    setLoading(true);
    setError('');
    setImages([]);
    try {
      const res = await fetch('/api/gallery', {
        headers: { Authorization: `Bearer ${token}` },
        method: 'POST',
        body: JSON.stringify({ slug: event.slug, password: event.password }),
      });
      if (!res.ok) {
        if (res.status === 401) {
          return handleLogout();
        }

        const data = await res.json();
        setError(data.error || 'Bilder konnten nicht geladen werden.');
        setLoading(false);
        return;
      }
      const data = await res.json();
      setImages(data);
      setLoading(false);
    } catch (err) {
      setError(err || 'Bilder konnten nicht geladen werden.');
      setLoading(false);
    }
  }

  async function fetchBoxes() {
    if (!token) return;
    const res = await fetch('/api/admin/box', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 401) {
      return handleLogout();
    }
    if (res.ok) {
      const data = await res.json();
      setBoxes(data);
    }
  }

  async function handleAddBox() {
    if (!boxLabel || !boxAccessToken) return setError('Gib Label und Token ein');

    const res = await fetch('/api/admin/box', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ label: boxLabel, accessToken: boxAccessToken }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Box konnte nicht hinzugefügt werden');
      return;
    }

    setBoxLabel('');
    setBoxAccessToken('');
    fetchBoxes();
    setShowAddBox(false);
  }

  async function handleDeleteBox(boxID: ObjectId) {
    if (!confirm('Bist du sicher, dass du diese Box löschen willst?')) return;

    const res = await fetch('/api/admin/box', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ boxID }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Box konnte nicht gelöscht werden.');
      return;
    }
    setBoxes(boxes.filter((box) => (box._id as unknown as ObjectId) !== boxID));
  }

  async function handleBoxActive(boxID: ObjectId, active: boolean) {
    const res = await fetch('/api/admin/box', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ boxID, active }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Box konnte nicht (in)aktiv gesetzt werden.');
      return;
    }
    fetchBoxes();
  }

  async function handleSetAllowUserUpload(eventId: ObjectId, allow_user_uploads: boolean) {
    const res = await fetch('/api/admin/allow-user-uploads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ eventId, allow_user_uploads }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Event konnte nicht verändert werden.');
      return;
    }
    fetchEvents();
  }

  async function handleAddLogo() {
    const eventId = showAddLogo; // grab eventid from setState

    if (!selectedLogo) {
      setError('Bitte zuerst eine Datei auswählen.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', selectedLogo);
      formData.append('eventId', eventId);
      const res = await fetch('/api/admin/logo', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },

        body: formData,
      });
      if (!res.ok) {
        const data = await res.json();
        throw Error(data.error || 'Upload fehlgeschlagen.');
      }

      setError('');
      setSelectedLogo(undefined);
      setLogoPreviewUrl(undefined);

      setShowAddLogo('');
      await fetchEvents();
    } catch (err) {
      setError(err.message || 'Ein Fehler ist aufgetreten.');
    }
  }

  async function handleDeleteLogo(eventId: ObjectId) {
    if (!confirm('Bist du sicher, dass du dieses Logo löschen willst?')) return;

    const res = await fetch(`/api/admin/logo`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ eventId }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Logo konnte nicht gelöscht werden.');
      return;
    }

    await fetchEvents();
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Bitte eine gültige Bilddatei auswählen.');
      setSelectedLogo(undefined);
      setLogoPreviewUrl(undefined);
      return;
    }
    setSelectedLogo(file);
    setLogoPreviewUrl(URL.createObjectURL(file));
    setError('');
  };

  async function handleDeleteImage(uuid: string) {
    if (!confirm('Bist du sicher, dass du dieses Bild löschen willst?')) return;

    const res = await fetch('/api/admin/delete-image', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ uuid }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Bild konnte nicht gelöscht werden.');
      return;
    }

    setImages(images.filter((img) => img.uuid !== uuid));
  }

  useEffect(() => {
    const savedToken = localStorage.getItem('adminToken');
    if (savedToken) {
      setToken(savedToken);
      setLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (loggedIn && token) {
      fetchEvents();
      fetchBoxes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn, token]);

  if (!loggedIn) {
    return (
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-secondary mx-auto max-w-xl p-6"
        >
          <h2 className="text-primary mb-6 text-lg font-semibold tracking-wide uppercase">
            Admin Login
          </h2>
          {error && <p className="text-error p-2 text-center text-sm">{error}</p>}

          <div className="space-y-3">
            <input
              type="text"
              placeholder="Benutzername"
              value={adminUsername}
              onChange={(e) => setAdminUsername(e.target.value)}
              className="bg-primary text-secondary w-full p-2 text-sm focus:outline-none"
            />
            <input
              type="password"
              placeholder="Passwort"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleLogin();
                }
              }}
              className="bg-primary text-secondary w-full p-2 text-sm focus:outline-none"
            />
            <button
              onClick={handleLogin}
              className="bg-primary text-secondary mt-4 w-full cursor-pointer p-3 text-sm font-semibold tracking-wide uppercase focus:outline-none"
            >
              Login
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading mt-6 mb-4 max-w-4xl pt-8 text-3xl font-extrabold text-balance hyphens-auto">
          Admin Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="bg-error hover:bg-error-dark cursor-pointer rounded-xl px-4 py-2 font-semibold shadow-lg transition"
        >
          Logout
        </button>
      </div>

      {/* Events Table */}
      <section className="mb-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Events</h2>
          <button
            onClick={() => {
              setError('');
              setShowAddEvent(true);
            }}
            className="bg-secondary text-primary hover:bg-accent-dark inline-flex cursor-pointer rounded-xl px-4 py-2 font-semibold shadow-lg transition"
          >
            <Plus /> Event hinzufügen
          </button>
        </div>

        <table className="bg-secondary w-full overflow-hidden text-left shadow-lg md:table-fixed">
          <thead className="hidden md:table-header-group">
            <tr className="bg-primary/80 text-secondary">
              <th className="p-3">Name</th>
              <th className="p-3">Slug</th>
              <th className="p-3">Passwort</th>
              <th className="p-3">Gäste Upload</th>
              <th className="p-3">Logo</th>
              <th className="p-3">Event aktiv</th>
              <th className="p-3">Aktionen</th>
            </tr>
          </thead>

          <tbody>
            {events.map((evt) => (
              <tr
                key={evt._id as unknown as string}
                className="border-accent text-primary bg-secondary mb-4 block rounded-xl border-b p-4 md:mb-0 md:table-row md:rounded-none md:bg-transparent md:p-0"
              >
                <td className="block p-3 md:table-cell">
                  <span className="text-primary/60 mb-1 block text-sm md:hidden">Name</span>
                  <Link
                    href={`/event/${evt.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 font-semibold hover:underline"
                  >
                    {evt.name} <ExternalLink className="size-4" />
                  </Link>
                </td>

                <td className="text-primary/70 block p-3 md:table-cell">
                  <span className="text-primary/60 mb-1 block text-sm md:hidden">Slug</span>
                  {evt.slug}
                </td>

                <td className="text-primary/70 block p-3 md:table-cell">
                  <span className="text-primary/60 mb-1 block text-sm md:hidden">Passwort</span>
                  {evt.password}
                </td>

                <td className="block p-3 md:table-cell">
                  <span className="text-primary/60 mb-1 block text-sm md:hidden">Gäste Upload</span>
                  <button
                    onClick={() => handleSetAllowUserUpload(evt._id, !evt.allow_user_uploads)}
                    className={`cursor-pointer rounded-xl px-3 py-1 font-semibold transition ${
                      evt.allow_user_uploads
                        ? 'bg-success hover:bg-success-dark'
                        : 'bg-error hover:bg-error-dark'
                    }`}
                  >
                    {evt.allow_user_uploads ? 'Ja' : 'Nein'}
                  </button>
                </td>

                <td className="block p-3 md:table-cell">
                  <span className="text-primary/60 mb-1 block text-sm md:hidden">Logo</span>
                  {evt.logo ? (
                    <div className="relative w-fit overflow-hidden rounded-xl shadow-lg">
                      <Image
                        alt={evt.logo}
                        width={100}
                        height={66}
                        src={`/api/admin/logo?logo=${evt.logo}&eventId=${evt._id}`}
                      />
                      <button
                        onClick={() => handleDeleteLogo(evt._id)}
                        className="bg-error hover:bg-error-dark text-primary absolute top-2 right-2 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full"
                      >
                        <X />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setError('');
                        setShowAddLogo(evt._id);
                      }}
                      className="bg-primary text-secondary cursor-pointer rounded-xl px-4 py-2 font-semibold"
                    >
                      <Plus /> Logo setzen
                    </button>
                  )}
                </td>

                <td className="block p-3 md:table-cell">
                  <span className="text-primary/60 mb-1 block text-sm md:hidden">Event aktiv</span>
                  {evt.active ? (
                    <span className="text-success font-semibold">Aktiv</span>
                  ) : (
                    <button
                      onClick={() => switchActiveEvent(evt._id)}
                      className="bg-primary text-secondary cursor-pointer rounded-xl px-3 py-1 font-semibold"
                    >
                      Setze Aktiv
                    </button>
                  )}
                </td>

                <td className="block p-3 md:table-cell md:text-right">
                  <span className="text-primary/60 mb-1 block text-sm md:hidden">Aktionen</span>
                  <div className="flex flex-wrap gap-2 md:justify-end">
                    <button
                      className="bg-primary text-secondary cursor-pointer rounded-xl px-3 py-1 font-semibold"
                      onClick={() => {
                        setImagesForEvent(evt);
                        void fetchImages(evt);
                      }}
                    >
                      Lade Bilder
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(evt._id)}
                      className="bg-error hover:bg-error-dark cursor-pointer rounded-xl px-3 py-1 font-semibold"
                    >
                      Löschen
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="mb-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Boxen</h2>
          <button
            onClick={() => {
              setError('');
              setShowAddBox(true);
            }}
            className="bg-secondary text-primary hover:bg-accent-dark inline-flex cursor-pointer rounded-xl px-4 py-2 font-semibold shadow-lg transition"
          >
            <Plus /> Box hinzufügen
          </button>
        </div>

        <table className="bg-secondary w-full text-left shadow-lg md:table">
          <thead className="hidden md:table-header-group">
            <tr className="bg-primary/80 text-secondary">
              <th className="p-3">Label</th>
              <th className="p-3">Letzter Upload</th>
              <th className="p-3">Zugangstoken</th>
              <th className="p-3">Status</th>
              <th className="p-3">Aktionen</th>
            </tr>
          </thead>
          <tbody className="block md:table-row-group">
            {boxes.map((box) => (
              <tr
                key={box._id as unknown as string}
                className="border-accent mb-4 block rounded-xl border-b p-4 md:mb-0 md:table-row md:rounded-none md:p-0"
              >
                <td className="text-primary/70 block p-3 font-semibold md:table-cell">
                  <span className="text-primary/60 mb-1 block text-xs md:hidden">Label</span>
                  {box.label}
                </td>

                <td className="text-primary/70 block p-3 md:table-cell">
                  <span className="text-primary/60 mb-1 block text-xs md:hidden">
                    Letzter Upload
                  </span>
                  {box.lastUpload ? new Date(box.lastUpload).toLocaleString('de-CH') : 'Never'}
                </td>

                <td className="text-primary/70 block p-3 break-all md:table-cell">
                  <span className="text-primary/60 mb-1 block text-xs md:hidden">Zugangstoken</span>
                  {box.accessToken}
                </td>

                <td className="block p-3 md:table-cell">
                  <span className="text-primary/60 mb-1 block text-xs md:hidden">Status</span>
                  {box.active ? (
                    <button
                      onClick={() => handleBoxActive(box._id, false)}
                      className="bg-primary text-secondary hover:bg-accent-dark cursor-pointer rounded-xl px-3 py-1 font-semibold transition"
                    >
                      Deaktivieren
                    </button>
                  ) : (
                    <button
                      onClick={() => handleBoxActive(box._id, true)}
                      className="bg-primary text-secondary hover:bg-accent-dark cursor-pointer rounded-xl px-3 py-1 font-semibold transition"
                    >
                      Aktivieren
                    </button>
                  )}
                </td>

                <td className="block p-3 md:table-cell md:text-right">
                  <span className="text-primary/60 mb-1 block text-xs md:hidden">Aktionen</span>
                  <button
                    onClick={() => handleDeleteBox(box._id)}
                    className="bg-error hover:bg-error-dark cursor-pointer rounded-xl px-3 py-1 font-semibold transition"
                  >
                    Löschen
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Images Grid */}
      {imagesForEvent && (
        <section>
          <h2 className="mb-4 text-2xl font-semibold">
            Bilder für den Event {imagesForEvent.name}
          </h2>
          {loading ? (
            <p>Lade Bilder...</p>
          ) : images.length === 0 ? (
            <p>Keine Bilder vorhanden.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {images.map((img) => (
                <motion.div
                  key={img.uuid}
                  whileHover={{ scale: 1.05 }}
                  className="relative overflow-hidden rounded-xl shadow-lg"
                >
                  <Link href={`/gallery/${img.uuid}`} target="_blank">
                    <Image
                      src={`/api/gallery?uuid=${img.uuid}`}
                      alt="foti-box.com"
                      width={300}
                      height={200}
                      className="h-40 w-full object-cover"
                    />
                  </Link>
                  <button
                    onClick={() => handleDeleteImage(img.uuid)}
                    className="text-primary bg-error hover:bg-error-dark absolute top-4 right-4 z-50 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full transition"
                  >
                    <X />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      )}

      {showAddEvent && (
        <Modal title="Event hinzufügen" onClose={() => setShowAddEvent(false)}>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Event Name"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className="text-secondary bg-primary rounded-xl p-3 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Event Slug"
              value={eventSlug}
              onChange={(e) => setEventSlug(e.target.value)}
              className="text-secondary bg-primary rounded-xl p-3 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Passwort"
              value={eventPassword}
              onChange={(e) => setEventPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddEvent();
              }}
              className="text-secondary bg-primary rounded-xl p-3 focus:outline-none"
            />
            {error && <p className="text-error">{error}</p>}
            <button
              onClick={handleAddEvent}
              className="bg-primary text-secondary hover:bg-accent-dark cursor-pointer rounded-xl px-4 py-2 font-semibold shadow-lg transition"
            >
              Event hinzufügen
            </button>
          </div>
        </Modal>
      )}

      {showAddBox && (
        <Modal title="Box hinzufügen" onClose={() => setShowAddBox(false)}>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Box Label"
              value={boxLabel}
              onChange={(e) => setBoxLabel(e.target.value)}
              className="text-secondary bg-primary rounded-xl p-3 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Zugangstoken"
              value={boxAccessToken}
              onChange={(e) => setBoxAccessToken(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddBox();
              }}
              className="text-secondary bg-primary rounded-xl p-3 focus:outline-none"
            />
            {error && <p className="text-error">{error}</p>}
            <button
              onClick={handleAddBox}
              className="bg-primary text-secondary hover:bg-accent-dark cursor-pointer rounded-xl px-4 py-2 font-semibold shadow-lg transition"
            >
              Box hinzufügen
            </button>
          </div>
        </Modal>
      )}

      {showAddLogo && (
        <Modal title="Logo setzen" onClose={() => setShowAddLogo('')}>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-primary text-xs tracking-wide uppercase">Bild auswählen</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="bg-primary text-secondary w-full border p-2 text-sm focus:outline-none"
              />

              {logoPreviewUrl && (
                <div className="mt-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logoPreviewUrl}
                    alt="Vorschau"
                    width={100}
                    className="border-accent max-h-60 w-full rounded border object-contain"
                  />
                </div>
              )}
            </div>
            {error && <p className="text-error">{error}</p>}
            {selectedLogo && (
              <button
                onClick={handleAddLogo}
                className="bg-primary text-secondary hover:bg-accent-dark cursor-pointer rounded-xl px-4 py-2 font-semibold shadow-lg transition"
              >
                Logo setzen
              </button>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
