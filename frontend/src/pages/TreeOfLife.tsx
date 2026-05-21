import React, { useState, useEffect } from 'react';
import { fetchJSON } from '../api';

const TreeOfLife = () => {
  const [nodes, setNodes] = useState<any[]>([]);
  const [hoveredNode, setHoveredNode] = useState<any>(null);
  const [attributionMode, setAttributionMode] = useState<'Thoth' | 'GD' | 'ColorKing' | 'GodName' | 'Archangel'>('Thoth');

  useEffect(() => {
    fetchJSON('thelemic_tree').then(setNodes);
  }, []);

  const sephiroth = nodes.filter(n => n.path_number <= 10);
  const paths = nodes.filter(n => n.path_number > 10);

  const renderAttribution = (node: any) => {
    switch (attributionMode) {
      case 'Thoth': return node.thoth_tarot_card || '';
      case 'GD': return node.gd_tarot_card || '';
      case 'ColorKing': return node.color_scale_king || '';
      case 'GodName': return node.god_name || '';
      case 'Archangel': return node.archangel || '';
      default: return '';
    }
  };

  return (
    <div style={{ padding: '2rem', display: 'flex', gap: '2rem' }}>
      <div style={{ flex: 1 }}>
        <h1>The Thelemic Tree of Life</h1>
        <p>Interactive Qabalah featuring Crowley's additions to the Golden Dawn system.</p>
        
        <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button onClick={() => setAttributionMode('Thoth')} style={{ padding: '0.5rem', background: attributionMode === 'Thoth' ? 'var(--accent-gold)' : 'var(--bg-obsidian)', color: attributionMode === 'Thoth' ? '#000' : 'var(--text-parchment)', cursor: 'pointer' }}>Thoth Tarot</button>
          <button onClick={() => setAttributionMode('GD')} style={{ padding: '0.5rem', background: attributionMode === 'GD' ? 'var(--accent-gold)' : 'var(--bg-obsidian)', color: attributionMode === 'GD' ? '#000' : 'var(--text-parchment)', cursor: 'pointer' }}>GD Tarot</button>
          <button onClick={() => setAttributionMode('ColorKing')} style={{ padding: '0.5rem', background: attributionMode === 'ColorKing' ? 'var(--accent-gold)' : 'var(--bg-obsidian)', color: attributionMode === 'ColorKing' ? '#000' : 'var(--text-parchment)', cursor: 'pointer' }}>King Color Scale</button>
          <button onClick={() => setAttributionMode('GodName')} style={{ padding: '0.5rem', background: attributionMode === 'GodName' ? 'var(--accent-gold)' : 'var(--bg-obsidian)', color: attributionMode === 'GodName' ? '#000' : 'var(--text-parchment)', cursor: 'pointer' }}>God Names</button>
          <button onClick={() => setAttributionMode('Archangel')} style={{ padding: '0.5rem', background: attributionMode === 'Archangel' ? 'var(--accent-gold)' : 'var(--bg-obsidian)', color: attributionMode === 'Archangel' ? '#000' : 'var(--text-parchment)', cursor: 'pointer' }}>Archangels</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginTop: '2rem' }}>
          {nodes.map(node => (
            <div 
              key={node.path_number} 
              className="glass-panel" 
              style={{ cursor: 'pointer', border: hoveredNode?.path_number === node.path_number ? '1px solid var(--accent-gold)' : '' }}
              onMouseEnter={() => setHoveredNode(node)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <h3 style={{ margin: 0 }}>
                {node.path_number}: {node.name || `Path of ${node.hebrew_letter}`}
              </h3>
              <p style={{ margin: '0.5rem 0 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                {renderAttribution(node)}
              </p>
              {node.is_swapped === 1 && (
                <span style={{ display: 'inline-block', marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--accent-crimson)', border: '1px solid var(--accent-crimson)', padding: '0.1rem 0.3rem', borderRadius: '4px' }}>
                  Crowley Tzaddi/Heh Swap
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Detail Popup Panel */}
      <div style={{ width: '350px' }}>
        {hoveredNode ? (
          <div className="glass-panel" style={{ position: 'sticky', top: '2rem' }}>
            <h2>{hoveredNode.path_number <= 10 ? 'Sephirah' : 'Path'} {hoveredNode.path_number}</h2>
            {hoveredNode.hebrew_letter && (
              <div style={{ fontSize: '3rem', fontFamily: 'var(--font-hebrew)', textAlign: 'center', margin: '1rem 0' }}>
                {hoveredNode.hebrew_letter}
              </div>
            )}
            <h3 style={{ color: 'var(--accent-gold)', marginTop: 0 }}>{hoveredNode.name}</h3>
            
            <div style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
              {hoveredNode.astrological_attribution && <p><strong>Astrology:</strong> {hoveredNode.astrological_attribution}</p>}
              {hoveredNode.thoth_tarot_card && <p><strong>Thoth:</strong> {hoveredNode.thoth_tarot_card}</p>}
              {hoveredNode.gd_tarot_card && <p><strong>GD Tarot:</strong> {hoveredNode.gd_tarot_card}</p>}
              {hoveredNode.god_name && <p><strong>God Name:</strong> {hoveredNode.god_name}</p>}
              {hoveredNode.archangel && <p><strong>Archangel:</strong> {hoveredNode.archangel}</p>}
              {hoveredNode.angel_choir && <p><strong>Angelic Choir:</strong> {hoveredNode.angel_choir}</p>}
              
              <hr style={{ borderColor: 'rgba(212,175,55,0.2)', margin: '1rem 0' }}/>
              
              <p><strong>Colors:</strong><br/>
                 King: {hoveredNode.color_scale_king}<br/>
                 Queen: {hoveredNode.color_scale_queen}<br/>
                 Emperor: {hoveredNode.color_scale_emperor}<br/>
                 Empress: {hoveredNode.color_scale_empress}
              </p>

              <hr style={{ borderColor: 'rgba(212,175,55,0.2)', margin: '1rem 0' }}/>
              
              {hoveredNode.crowley_tweaks && (
                <div style={{ background: 'rgba(139,0,0,0.1)', borderLeft: '3px solid var(--accent-crimson)', padding: '0.5rem', marginBottom: '1rem' }}>
                  <strong>Crowley's Tweak:</strong><br/>
                  {hoveredNode.crowley_tweaks}
                </div>
              )}
              <p>{hoveredNode.description}</p>
            </div>
          </div>
        ) : (
          <div className="glass-panel" style={{ position: 'sticky', top: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Hover over a node to see detailed attributions and Crowley's modifications.
          </div>
        )}
      </div>
    </div>
  );
};

export default TreeOfLife;
