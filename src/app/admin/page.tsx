'use client';

import { H1 } from '@/components/ui/headings';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface ImageType {
  uuid: string;
  url: string;
  event: string;
  createdAt: string;
}

export default function AdminPage() {
  const [images, setImages] = useState<ImageType[]>([]);
  const [eventName, setEventName] = useState('');
  const [eventPassword, setEventPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [events, setEvents] = useState<
    { _id: string; name: string; active: boolean; allow_user_uploads: boolean }[]
  >([]);

  async function fetchEvents() {
    if (!token) return;
    const res = await fetch('/api/admin/events', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setEvents(data);
    }
  }

  async function switchActiveEvent(eventId: string) {
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
      fetchImages();
    }
  }, [loggedIn, token]);

  async function handleLogin() {
    setError('');
    if (!adminUsername || !adminPassword) return setError('Enter username and password');

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: adminUsername, password: adminPassword }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Login failed');
      return;
    }

    const data = await res.json();
    localStorage.setItem('adminToken', data.token);
    setToken(data.token);
    setLoggedIn(true);
  }

  function handleLogout() {
    localStorage.removeItem('adminToken');
    setToken(null);
    setLoggedIn(false);
  }

  async function fetchImages() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/images', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to fetch images');
        setLoading(false);
        return;
      }
      const data = await res.json();
      setImages(data);
    } catch (err) {
      setError(err || 'Error fetching images');
    } finally {
      setLoading(false);
    }
  }

  async function handleAddEvent() {
    if (!eventName || !eventPassword) return setError('Provide name and password');

    const res = await fetch('/api/admin/add-event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: eventName, password: eventPassword }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Failed to add event');
      return;
    }

    setEventName('');
    setEventPassword('');
    fetchEvents();
  }

  async function handleDeleteEvent(eventID: string) {
    if (!confirm('Are you sure you want to delete this event?')) return;

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
      setError(data.error || 'Failed to delete event');
      return;
    }
    setImages(images.filter((img) => img.event !== eventID));
    setEvents(events.filter((event) => event._id !== eventID));
  }

  async function handleSetAllowUserUpload(eventId: string, allow_user_uploads: boolean) {
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
      setError(data.error || 'Failed to update event');
      return;
    }
    fetchEvents();
  }

  async function handleDeleteImage(uuid: string) {
    if (!confirm('Are you sure you want to delete this image?')) return;

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
      setError(data.error || 'Failed to delete image');
      return;
    }

    setImages(images.filter((img) => img.uuid !== uuid));
  }

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
          {error && <p className="p-2 text-center text-sm text-error">{error}</p>}

          <div className="space-y-3">
            <input
              type="text"
              placeholder="Username"
              value={adminUsername}
              onChange={(e) => setAdminUsername(e.target.value)}
              className="bg-primary text-secondary w-full p-2 text-sm focus:outline-none"
            />
            <input
              type="password"
              placeholder="Password"
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
    <div>
      <div className="mb-6 flex items-center justify-between">
        <H1>Admin Dashboard</H1>
        <button
          onClick={handleLogout}
          className="bg-error hover:bg-error-dark cursor-pointer rounded-xl px-4 py-2 font-semibold shadow-lg transition"
        >
          Logout
        </button>
      </div>

      {/* Manage Events */}
      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">Manage Events</h2>
        <div className="space-y-2">
          {events.map((evt) => (
            <div
              key={evt._id}
              className="text-primary bg-secondary border-accent flex items-center justify-between rounded-xl border p-3"
            >
              <span className={evt.active ? 'font-bold' : ''}>{evt.name}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSetAllowUserUpload(evt._id, !evt.allow_user_uploads)}
                  className={`cursor-pointer rounded-xl px-3 py-1 font-semibold transition ${evt.allow_user_uploads ? 'bg-success hover:bg-success-dark' : 'bg-error hover:bg-error-dark'}`}
                >
                  Allows User Uploads
                </button>
                {!evt.active && (
                  <button
                    onClick={() => handleDeleteEvent(evt._id)}
                    className="hover:bg-error-dark bg-error cursor-pointer rounded-xl px-3 py-1 font-semibold transition"
                  >
                    Delete
                  </button>
                )}
                {!evt.active ? (
                  <button
                    onClick={() => switchActiveEvent(evt._id)}
                    className="bg-primary text-secondary hover:bg-accent-dark cursor-pointer rounded-xl px-3 py-1 font-semibold transition"
                  >
                    Set Active
                  </button>
                ) : (
                  <span className="text-success font-semibold">Active</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Add Event */}
      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">Create New Event</h2>
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Event Name"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            className="text-primary bg-secondary rounded-xl p-3 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Password"
            value={eventPassword}
            onChange={(e) => setEventPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAddEvent();
              }
            }}
            className="text-primary bg-secondary rounded-xl p-3 focus:outline-none"
          />
          <button
            onClick={handleAddEvent}
            className="text-primary bg-secondary hover:bg-accent cursor-pointer rounded-xl px-4 py-2 font-semibold shadow-lg transition"
          >
            Add Event
          </button>
        </div>
        {error && <p className="text-error mt-2">{error}</p>}
      </section>

      {/* Images */}
      <section>
        <h2 className="mb-4 text-2xl font-semibold">All Images</h2>
        {loading ? (
          <p>Loading images...</p>
        ) : error ? (
          <p className="text-error">{error}</p>
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
                  className="text-primary bg-error hover:bg-error-dark absolute top-4 right-4 z-100 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full transition"
                >
                  X
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
