import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  fetchGifts,
  createGift,
  updateGift,
  deleteGift,
  fetchGiftRules,
  createGiftRule,
  updateGiftRule,
  deleteGiftRule,
} from '../api/client';
import GiftForm from '../components/gifts/GiftForm';
import GiftRulesPanel from '../components/gifts/GiftRulesPanel';
import '../styles/GiftManagerView.css';

export default function GiftManagerView() {
  const { adminId } = useAuth();
  const [gifts, setGifts] = useState([]);
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingGift, setEditingGift] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [giftsData, rulesData] = await Promise.all([
        fetchGifts(),
        fetchGiftRules(),
      ]);
      setGifts(giftsData);
      setRules(rulesData);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGift = async (formData) => {
    try {
      if (editingGift) {
        const updated = await updateGift(editingGift.gift_id, formData, adminId);
        setGifts(gifts.map(g => g.gift_id === updated.gift_id ? updated : g));
      } else {
        const created = await createGift(formData, adminId);
        setGifts([...gifts, created]);
      }
      setShowForm(false);
      setEditingGift(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteGift = async (giftId) => {
    if (window.confirm('Delete this gift? This action cannot be undone.')) {
      try {
        await deleteGift(giftId, adminId);
        setGifts(gifts.filter(g => g.gift_id !== giftId));
        setRules(rules.filter(r => r.gift_id !== giftId));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleEditGift = (gift) => {
    setEditingGift(gift);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingGift(null);
  };

  const handleAddRule = async (ruleData) => {
    try {
      const created = await createGiftRule(ruleData, adminId);
      setRules([...rules, created]);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateRule = async (ruleId, ruleData) => {
    try {
      const updated = await updateGiftRule(ruleId, ruleData, adminId);
      setRules(rules.map(r => r.rule_id === ruleId ? updated : r));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteRule = async (ruleId) => {
    if (window.confirm('Delete this rule?')) {
      try {
        await deleteGiftRule(ruleId, adminId);
        setRules(rules.filter(r => r.rule_id !== ruleId));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading gifts...</div>;
  }

  return (
    <div className="gift-manager-view">
      <div className="view-header">
        <h1>🎁 Gift Rewards Management</h1>
        <button
          className="btn-primary"
          onClick={() => {
            setEditingGift(null);
            setShowForm(true);
          }}
        >
          + New Gift
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <GiftForm
          gift={editingGift}
          onSave={handleSaveGift}
          onCancel={handleCancelForm}
        />
      )}

      <div className="gift-manager-content">
        <div className="gifts-section">
          <h2>Gifts Catalog</h2>
          <div className="gifts-list">
            {gifts.length === 0 ? (
              <p className="empty-state">No gifts created yet</p>
            ) : (
              gifts.map(gift => (
                <div key={gift.gift_id} className="gift-card">
                  <div className="gift-header">
                    <h3>{gift.name}</h3>
                    <div className="gift-actions">
                      <button
                        className="btn-small btn-edit"
                        onClick={() => handleEditGift(gift)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-small btn-delete"
                        onClick={() => handleDeleteGift(gift.gift_id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  {gift.imageUrl && (
                    <img src={gift.imageUrl} alt={gift.name} className="gift-image" />
                  )}
                  <p className="gift-description">{gift.description}</p>
                  <div className="gift-meta">
                    <span className="meta-item">
                      💰 <strong>{gift.pointCost}</strong> points
                    </span>
                    {gift.quantityAvailable && (
                      <span className="meta-item">
                        📦 <strong>{gift.quantityAvailable}</strong> available
                      </span>
                    )}
                    <span className={`meta-item status ${gift.active ? 'active' : 'inactive'}`}>
                      {gift.active ? '✓ Active' : '✗ Inactive'}
                    </span>
                  </div>
                  <div className="validity-info">
                    <p>
                      📅 Valid from {new Date(gift.validFrom).toLocaleDateString()} to{' '}
                      {new Date(gift.validUntil).toLocaleDateString()}
                    </p>
                    {gift.isExpired && (
                      <p className="expired-notice">⚠️ Expired - cannot award new gifts</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rules-section">
          <GiftRulesPanel
            gifts={gifts}
            rules={rules}
            onAddRule={handleAddRule}
            onUpdateRule={handleUpdateRule}
            onDeleteRule={handleDeleteRule}
          />
        </div>
      </div>
    </div>
  );
}
