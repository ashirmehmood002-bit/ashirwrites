/* public/js/api.js — Centralised API client */
'use strict';

const API = (() => {
  const BASE = window.location.origin + '/api';

  function getToken() { return localStorage.getItem('aw_token'); }
  function setToken(t) { localStorage.setItem('aw_token', t); }
  function clearToken() { localStorage.removeItem('aw_token'); }

  async function request(method, path, body) {
    const headers = { 'Content-Type': 'application/json' };
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(BASE + path, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json();
    if (!res.ok) throw { status: res.status, message: data.error || data.errors?.join(', ') || 'Request failed' };
    return data;
  }

  return {
    getToken, setToken, clearToken,
    get: (p) => request('GET', p),
    post: (p, b) => request('POST', p, b),
    put: (p, b) => request('PUT', p, b),
    del: (p) => request('DELETE', p),
  };
})();
