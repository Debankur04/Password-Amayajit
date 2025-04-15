'use client'

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Eye, EyeOff, Plus, Pencil, Trash2, Save, X, Lock, RefreshCw } from 'lucide-react';

const baseUrl = process.env.NEXT_PUBLIC_BackendUrl;

export default function PasswordManager() {
  const [credentials, setCredentials] = useState([]);
  const [form, setForm] = useState({ url: '', username: '', password: '' });
  const [editingUrl, setEditingUrl] = useState(null);
  const [showPasswords, setShowPasswords] = useState({});
  const [theme, setTheme] = useState('light');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCredentials = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${baseUrl}/api/credentials/read`);
      if (res.data.success) {
        setCredentials(res.data.credentials);
      }
      setError(null);
    } catch (err) {
      setError('Failed to load credentials');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCredentials();
    
    // Load theme preference from localStorage
    const savedTheme = localStorage.getItem('passwordManagerTheme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.url || !form.username || !form.password) {
      setError('Please fill all fields');
      return;
    }

    try {
      setIsLoading(true);
      if (editingUrl) {
        await axios.put(`${baseUrl}/api/credentials/update`, form);
        setEditingUrl(null);
      } else {
        await axios.post(`${baseUrl}/api/credentials/add`, form);
      }
      setForm({ url: '', username: '', password: '' });
      fetchCredentials();
      setError(null);
    } catch (err) {
      setError(editingUrl ? 'Failed to update credential' : 'Failed to add credential');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (cred) => {
    setForm(cred);
    setEditingUrl(cred.url);
  };

  const handleDelete = async (url) => {
    if (confirm('Are you sure you want to delete this credential?')) {
      try {
        setIsLoading(true);
        await axios.delete(`${baseUrl}/api/credentials/delete`, { data: { url } });
        fetchCredentials();
      } catch (err) {
        setError('Failed to delete credential');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const cancelEdit = () => {
    setForm({ url: '', username: '', password: '' });
    setEditingUrl(null);
  };

  const togglePasswordVisibility = (url) => {
    setShowPasswords({
      ...showPasswords,
      [url]: !showPasswords[url]
    });
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('passwordManagerTheme', newTheme);
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setForm({ ...form, password });
  };

  return (
    <div className={`min-h-screen p-6 ${theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className={`p-4 flex justify-between items-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-indigo-600 text-white'}`}>
          <div className="flex items-center gap-2">
            <Lock size={24} />
            <h2 className="text-xl font-bold">Password Manager</h2>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={fetchCredentials} 
              className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-600 hover:bg-gray-500' : 'bg-indigo-500 hover:bg-indigo-400'}`}
              disabled={isLoading}
              title="Refresh"
            >
              <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
            </button>
            <button 
              onClick={toggleTheme} 
              className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-600 hover:bg-gray-500' : 'bg-indigo-500 hover:bg-indigo-400'}`}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
        
        <div className={`p-6 ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'}`}>
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
              <button 
                onClick={() => setError(null)} 
                className="float-right font-bold"
              >
                &times;
              </button>
            </div>
          )}
          
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex gap-2">
              <input
                className={`border px-3 py-2 rounded flex-1 ${theme === 'dark' ? 'bg-gray-600 border-gray-500 text-white' : 'bg-gray-50'}`}
                placeholder="Website URL"
                name="url"
                value={form.url}
                onChange={handleChange}
              />
            </div>
            <div className="flex gap-2">
              <input
                className={`border px-3 py-2 rounded flex-1 ${theme === 'dark' ? 'bg-gray-600 border-gray-500 text-white' : 'bg-gray-50'}`}
                placeholder="Username or Email"
                name="username"
                value={form.username}
                onChange={handleChange}
              />
            </div>
            <div className="flex gap-2">
              <input
                className={`border px-3 py-2 rounded flex-1 ${theme === 'dark' ? 'bg-gray-600 border-gray-500 text-white' : 'bg-gray-50'}`}
                placeholder="Password"
                type={showPasswords['form'] ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
              />
              <button
                onClick={() => togglePasswordVisibility('form')}
                className={`px-3 py-1 rounded ${theme === 'dark' ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                {showPasswords['form'] ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              <button
                onClick={generatePassword}
                className={`px-3 py-1 rounded ${theme === 'dark' ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                Generate
              </button>
            </div>
            <div className="flex gap-2">
              {editingUrl ? (
                <>
                  <button
                    onClick={handleSubmit}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
                    disabled={isLoading}
                  >
                    <Save size={18} /> Update
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:opacity-50"
                    disabled={isLoading}
                  >
                    <X size={18} /> Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="flex-1 flex items-center justify-center gap-2 bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 disabled:opacity-50"
                  disabled={isLoading}
                >
                  <Plus size={18} /> Add Password
                </button>
              )}
            </div>
          </div>

          {isLoading && !credentials.length ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            <div className="space-y-3">
              {credentials.length === 0 ? (
                <p className="text-center py-6 text-gray-500">No saved passwords yet</p>
              ) : (
                credentials.map((cred) => (
                  <div
                    key={cred.url}
                    className={`flex items-center justify-between p-3 rounded ${
                      theme === 'dark' ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-50 hover:bg-gray-100'
                    } border transition-colors`}
                  >
                    <div className="overflow-hidden">
                      <div className="font-medium truncate">{cred.url}</div>
                      <div className="text-sm text-gray-500 truncate">{cred.username}</div>
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-mono">
                          {showPasswords[cred.url] ? cred.password : '••••••••••••'}
                        </div>
                        <button
                          onClick={() => togglePasswordVisibility(cred.url)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          {showPasswords[cred.url] ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(cred)}
                        className={`p-2 rounded-full ${theme === 'dark' ? 'hover:bg-gray-500' : 'hover:bg-gray-200'}`}
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(cred.url)}
                        className={`p-2 rounded-full text-red-500 ${theme === 'dark' ? 'hover:bg-gray-500' : 'hover:bg-red-100'}`}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
        
        <div className={`py-2 px-4 text-center text-sm ${theme === 'dark' ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
          Securely stored in your database
        </div>
      </div>
    </div>
  );
}