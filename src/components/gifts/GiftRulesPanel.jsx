import React, { useState } from 'react';
import '../styles/GiftRulesPanel.css';

export default function GiftRulesPanel({ gifts, rules, onAddRule, onUpdateRule, onDeleteRule }) {
  const [showForm, setShowForm] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [formData, setFormData] = useState({
    giftId: '',
    triggerPoints: '',
  });

  const handleOpenForm = (rule = null) => {
    if (rule) {
      setEditingRule(rule);
      setFormData({
        giftId: rule.gift_id,
        triggerPoints: rule.trigger_points,
      });
    } else {
      setEditingRule(null);
      setFormData({
        giftId: '',
        triggerPoints: '',
      });
    }
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingRule(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.giftId || !formData.triggerPoints) {
      alert('Please fill in all fields');
      return;
    }

    try {
      if (editingRule) {
        await onUpdateRule(editingRule.rule_id, {
          triggerPoints: formData.triggerPoints,
        });
      } else {
        await onAddRule(formData);
      }
      handleCloseForm();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const getGiftName = (giftId) => {
    const gift = gifts.find(g => g.gift_id === giftId);
    return gift ? gift.name : `Gift #${giftId}`;
  };

  return (
    <div className="gift-rules-panel">
      <div className="rules-header">
        <h2>🎯 Reward Rules</h2>
        <button
          className="btn-primary btn-small"
          onClick={() => handleOpenForm()}
        >
          + Add Rule
        </button>
      </div>

      {showForm && (
        <div className="rule-form">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="ruleGiftId">Select Gift</label>
              <select
                id="ruleGiftId"
                value={formData.giftId}
                onChange={(e) => setFormData(prev => ({ ...prev, giftId: Number(e.target.value) }))}
              >
                <option value="">Choose a gift...</option>
                {gifts.map(gift => (
                  <option key={gift.gift_id} value={gift.gift_id}>
                    {gift.name} ({gift.pointCost} points)
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="ruleTriggerPoints">Award when user has ≥ points</label>
              <input
                type="number"
                id="ruleTriggerPoints"
                value={formData.triggerPoints}
                onChange={(e) => setFormData(prev => ({ ...prev, triggerPoints: e.target.value }))}
                placeholder="e.g., 10000"
                min="1"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary btn-small">
                {editingRule ? 'Update Rule' : 'Create Rule'}
              </button>
              <button type="button" className="btn-secondary btn-small" onClick={handleCloseForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="rules-list">
        {rules.length === 0 ? (
          <p className="empty-state">No reward rules configured yet</p>
        ) : (
          rules.map(rule => (
            <div key={rule.rule_id} className="rule-item">
              <div className="rule-content">
                <h4>{getGiftName(rule.gift_id)}</h4>
                <p className="rule-description">
                  Award when user reaches <strong>{rule.triggerPoints.toLocaleString()}</strong> points
                </p>
              </div>
              <div className="rule-actions">
                <button
                  className="btn-small btn-edit"
                  onClick={() => handleOpenForm(rule)}
                >
                  Edit
                </button>
                <button
                  className="btn-small btn-delete"
                  onClick={() => {
                    if (window.confirm('Delete this rule?')) {
                      onDeleteRule(rule.rule_id);
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
