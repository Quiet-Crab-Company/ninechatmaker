import React, { useState, useRef, useEffect } from 'react';
import { characters as staticCharacters } from './data/characters';
import StickerPicker, { STICKERS } from './components/StickerPicker';
import html2canvas from 'html2canvas';
import JSZip from 'jszip';
import {
  Settings,
  Trash,
  Download,
  Smile,
  Send,
  Edit3,
  Check,
  X,
  Globe,
  CheckSquare,
  Plus,
  ChevronDown,
  Loader2
} from 'lucide-react';

function App() {
  // Custom characters loaded from local browser cache
  const [customCharacters, setCustomCharacters] = useState(() => {
    const saved = localStorage.getItem('ninechat_custom_characters');
    return saved ? JSON.parse(saved) : [];
  });

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('ninechat_messages');
    return saved ? JSON.parse(saved) : [];
  });
  const [recipientId, setRecipientId] = useState(() => {
    return localStorage.getItem('ninechat_recipient_id') || staticCharacters[0].id;
  });
  const [title, setTitle] = useState(() => {
    const val = localStorage.getItem('ninechat_title') || '';
    if (val === 'Title' || val === 'タイトル') return '';
    return val;
  });
  const [subtitle, setSubtitle] = useState(() => {
    const val = localStorage.getItem('ninechat_subtitle') || '';
    if (val === 'Change title and subtitle with the gear icon' || val === '歯車アイコンからタイトルとサブタイトルを変更できます') return '';
    return val;
  });
  const [language, setLanguage] = useState('en');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState('');

  // Combine custom and pre-installed characters
  const allCharacters = [...customCharacters, ...staticCharacters];

  // Active composer states
  const [currentSenderId, setCurrentSenderId] = useState(staticCharacters[0].id);
  const [isMeToggle, setIsMeToggle] = useState(false); // If true, forces sending as the recipient
  const [messageText, setMessageText] = useState('');
  const [showStickers, setShowStickers] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSpeakerDropdown, setShowSpeakerDropdown] = useState(false);

  // Inline editing states
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  // Custom character creation form states
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customInitials, setCustomInitials] = useState('');
  const [avatarSourceType, setAvatarSourceType] = useState('initials'); // 'initials', 'file', or 'url'
  const [customAvatarFile, setCustomAvatarFile] = useState('');
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [customColor, setCustomColor] = useState('#8a2be2');
  const customDrawerRef = useRef(null);
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isFilePickerActive, setIsFilePickerActive] = useState(false);

  const previewEndRef = useRef(null);
  const prevLengthRef = useRef(0);
  const settingsDrawerRef = useRef(null);
  const settingsButtonRef = useRef(null);
  const speakerDropdownRef = useRef(null);

  // Auto-scroll inside the simulator body only when new messages are added or on mount
  useEffect(() => {
    if (messages.length > prevLengthRef.current) {
      previewEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    prevLengthRef.current = messages.length;
  }, [messages]);

  // Keep default title and subtitle in sync with active language if user has not custom-edited them
  useEffect(() => {
    if (language === 'jp') {
      if (title === 'Title') {
        setTitle('タイトル');
      }
      if (subtitle === 'Change title and subtitle with the gear icon') {
        setSubtitle('歯車アイコンからタイトルとサブタイトルを変更できます');
      }
    } else {
      if (title === 'タイトル') {
        setTitle('Title');
      }
      if (subtitle === '歯車アイコンからタイトルとサブタイトルを変更できます') {
        setSubtitle('Change title and subtitle with the gear icon');
      }
    }
  }, [language]);

  // Close settings or custom drawers when tapping anywhere else outside them
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSettings) {
        const clickedDrawer = settingsDrawerRef.current && settingsDrawerRef.current.contains(event.target);
        const clickedButton = settingsButtonRef.current && settingsButtonRef.current.contains(event.target);
        if (!clickedDrawer && !clickedButton) {
          setShowSettings(false);
        }
      }
      if (showAddCustom) {
        if (isFilePickerActive) return; // Ignore click outside if native file picker dialog is active/closing
        const clickedDrawer = customDrawerRef.current && customDrawerRef.current.contains(event.target);
        const clickedDropdownTrigger = event.target.closest('.add-custom-trigger');
        if (!clickedDrawer && !clickedDropdownTrigger) {
          setShowAddCustom(false);
        }
      }
      if (showSpeakerDropdown) {
        const clickedDropdown = speakerDropdownRef.current && speakerDropdownRef.current.contains(event.target);
        if (!clickedDropdown) {
          setShowSpeakerDropdown(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showSettings, showAddCustom, showSpeakerDropdown, isFilePickerActive]);

  // Monitor window focus to reset file picker active flag when native dialog closes
  useEffect(() => {
    const handleWindowFocus = () => {
      setTimeout(() => {
        setIsFilePickerActive(false);
      }, 500);
    };
    window.addEventListener('focus', handleWindowFocus);
    return () => {
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, []);

  // Sync editor preview settings and messages to localStorage
  useEffect(() => {
    localStorage.setItem('ninechat_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('ninechat_recipient_id', recipientId);
  }, [recipientId]);

  useEffect(() => {
    localStorage.setItem('ninechat_title', title);
  }, [title]);

  useEffect(() => {
    localStorage.setItem('ninechat_subtitle', subtitle);
  }, [subtitle]);

  const getCharacter = (id) => {
    return allCharacters.find((c) => c.id === id);
  };

  const handleAvatarFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Downscale image to max 120x120 pixels to keep localStorage footprint under 10KB
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 120;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/png');
        setCustomAvatarFile(dataUrl);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleCreateCustomCharacter = () => {
    if (!customName.trim()) return;

    const id = 'custom_' + Date.now();

    let avatar = null;
    if (avatarSourceType === 'file') {
      avatar = customAvatarFile;
    } else if (avatarSourceType === 'url') {
      avatar = customAvatarUrl;
    }

    // Determine initials
    const nameParts = customName.trim().split(/\s+/);
    const defaultInit = nameParts.length > 1
      ? nameParts.map(part => part[0] || '').join('').toUpperCase()
      : (customName.trim() ? customName.trim()[0].toUpperCase() : '?');

    const initials = customInitials.trim() || defaultInit || '?';

    const newChar = {
      id,
      name: customName.trim(),
      nameJp: customName.trim(),
      color: customColor,
      avatar: avatar && avatar.trim() ? avatar : null,
      initialsEn: initials,
      initialsJp: initials
    };

    const updatedList = [...customCharacters, newChar];
    setCustomCharacters(updatedList);
    localStorage.setItem('ninechat_custom_characters', JSON.stringify(updatedList));

    // Automatically set the new character as active sender
    setCurrentSenderId(id);

    // Reset inputs
    setCustomName('');
    setCustomInitials('');
    setCustomAvatarFile('');
    setCustomAvatarUrl('');
    setCustomColor('#8a2be2');
    setShowAddCustom(false);
  };

  const handleCustomNameChange = (e) => {
    const val = e.target.value;
    setCustomName(val);

    // Auto extract initials (first letter of each word, or first letter if single word)
    const nameParts = val.trim().split(/\s+/);
    let autoInitials = '';
    if (nameParts.length > 1) {
      autoInitials = nameParts.map(part => part[0] || '').join('').toUpperCase();
    } else if (val.trim()) {
      autoInitials = val.trim()[0].toUpperCase();
    }
    setCustomInitials(autoInitials);
  };

  const handleDeleteCustomCharacter = (id, name) => {
    setDeleteConfirmTarget({ id, name });
  };

  // Determine current active sender based on character dropdown and "Is Me" toggle
  const getActiveSenderId = () => {
    return isMeToggle ? recipientId : currentSenderId;
  };

  const handleAddMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    const newMessage = {
      id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      senderId: getActiveSenderId(),
      message: messageText,
      messageType: 'text'
    };

    setMessages([...messages, newMessage]);
    setMessageText('');
  };

  const handleSendSticker = (stickerCode) => {
    const newMessage = {
      id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      senderId: getActiveSenderId(),
      message: stickerCode,
      messageType: 'stamp'
    };
    setMessages([...messages, newMessage]);
    setShowStickers(false);
  };

  // Reorder messages
  const moveMessage = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= messages.length) return;

    const updated = [...messages];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setMessages(updated);
  };

  // Delete message
  const deleteMessage = (id) => {
    setMessages(messages.filter((m) => m.id !== id));
    if (editingId === id) setEditingId(null);
  };

  // Start inline editing
  const startEditing = (msg) => {
    setEditingId(msg.id);
    setEditText(msg.message);
  };

  // Save inline edit
  const saveEdit = (id) => {
    setMessages(
      messages.map((m) => (m.id === id ? { ...m, message: editText } : m))
    );
    setEditingId(null);
  };

  const clearAll = () => {
    setShowClearConfirm(true);
  };

  // Logic to calculate unique speakers for top-right cluster
  const uniqueSpeakers = [];
  messages.forEach((msg) => {
    if (msg.senderId && !uniqueSpeakers.includes(msg.senderId)) {
      uniqueSpeakers.push(msg.senderId);
    }
  });

  const speakerObjects = uniqueSpeakers
    .map((id) => getCharacter(id))
    .filter(Boolean);

  const top3Speakers = speakerObjects.slice(0, 3);
  const remainingCount = speakerObjects.length > 3 ? speakerObjects.length - 3 : 0;

  // Render a character avatar or colored circle with initials fallback
  const renderAvatar = (char, sizeClass = 'avatar-normal') => {
    if (!char) return null;
    const isJp = language === 'jp';
    const initials = isJp ? char.initialsJp : char.initialsEn;

    if (char.avatar) {
      return (
        <img
          src={char.avatar}
          alt={isJp ? char.nameJp : char.name}
          className={`avatar-img ${sizeClass}`}
        />
      );
    }

    return (
      <div
        className={`avatar-fallback ${sizeClass}`}
        style={{ backgroundColor: char.color }}
      >
        <span>{initials}</span>
      </div>
    );
  };

  // PNG/ZIP Export Slicing Flow
  const runExportFlow = async () => {
    if (messages.length === 0) return;
    setIsExporting(true);
    setExportProgress(language === 'jp' ? 'メッセージの高さを計算中...' : 'Calculating message heights...');

    try {
      const livePreviewBox = document.querySelector('.chat-preview-box');
      const exportWidth = Math.max(livePreviewBox ? livePreviewBox.clientWidth : 420, 420);

      const messageElements = document.querySelectorAll('.chat-preview-message');
      const heights = Array.from(messageElements).map(el => el.getBoundingClientRect().height || el.offsetHeight);

      const getFallbackHeight = (msg) => {
        if (msg.messageType === 'stamp') return 130;
        const textLen = msg.message.length;
        if (textLen > 100) return 120;
        if (textLen > 50) return 90;
        return 70;
      };

      const messageHeights = messages.map((msg, index) => {
        return heights[index] || getFallbackHeight(msg);
      });

      const MAX_PAGE_HEIGHT = 900;
      const pages = [];
      let currentPage = [];
      let currentPageHeight = 0;

      messages.forEach((msg, index) => {
        const height = messageHeights[index];
        const headerPadding = pages.length === 0 ? 56 : 0;

        if (currentPage.length > 0 && currentPageHeight + height + headerPadding > MAX_PAGE_HEIGHT) {
          pages.push(currentPage);
          currentPage = [msg];
          currentPageHeight = height;
        } else {
          currentPage.push(msg);
          currentPageHeight += height;
        }
      });

      if (currentPage.length > 0) {
        pages.push(currentPage);
      }

      setExportProgress(language === 'jp' ? '画像を生成中...' : 'Generating images...');

      const zip = new JSZip();
      const pageImages = [];

      for (let p = 0; p < pages.length; p++) {
        setExportProgress(
          language === 'jp'
            ? `ページ ${p + 1} / ${pages.length} を処理中...`
            : `Processing page ${p + 1} of ${pages.length}...`
        );

        const tempContainer = document.createElement('div');
        tempContainer.className = 'unified-simulator-box export-only-box';
        tempContainer.style.width = `${exportWidth}px`;
        tempContainer.style.position = 'fixed';
        tempContainer.style.left = '-9999px';
        tempContainer.style.top = '-9999px';
        tempContainer.style.height = 'auto';
        tempContainer.style.minHeight = '0';
        tempContainer.style.maxHeight = 'none';
        tempContainer.style.borderRadius = '0'; // Flat edges for export splits
        tempContainer.style.boxShadow = 'none';
        tempContainer.style.border = 'none';

        const previewBox = document.createElement('div');
        previewBox.className = 'chat-preview-box';
        previewBox.style.height = 'auto';
        previewBox.style.minHeight = '0';
        previewBox.style.maxHeight = 'none';
        previewBox.style.flexGrow = '0';
        previewBox.style.borderRadius = '0';

        // Clone header (always include on every page)
        const liveHeader = document.querySelector('.chat-preview-header');
        if (liveHeader) {
          const headerClone = liveHeader.cloneNode(true);
          headerClone.style.borderRadius = '0';
          previewBox.appendChild(headerClone);
        }

        const previewBody = document.createElement('div');
        previewBody.className = 'chat-preview-body';
        previewBody.style.height = 'auto';
        previewBody.style.maxHeight = 'none';
        previewBody.style.flexGrow = '0';
        previewBody.style.overflow = 'visible';

        const pageMessages = pages[p];
        pageMessages.forEach((msg) => {
          const originalIndex = messages.findIndex(m => m.id === msg.id);
          if (originalIndex !== -1 && messageElements[originalIndex]) {
            const messageClone = messageElements[originalIndex].cloneNode(true);

            // Remove hover action buttons from the clone
            const hoverActions = messageClone.querySelector('.message-hover-actions');
            if (hoverActions) {
              hoverActions.remove();
            }

            // Remove inline edit overlay from the clone if present
            const inlineEdit = messageClone.querySelector('.inline-bubble-edit');
            if (inlineEdit) {
              inlineEdit.remove();
            }

            // Clean any browser-injected elements (like Grammarly spans) inside text bubble
            const textBubble = messageClone.querySelector('.message-bubble-text');
            if (textBubble) {
              textBubble.innerHTML = textBubble.textContent;
            }

            // Apply inline styles to cloned wrappers to prevent html2canvas box-shadow + border-radius rendering bugs
            const wrapper = messageClone.querySelector('.message-bubble-wrapper');
            if (wrapper) {
              const isMe = msg.senderId === recipientId;
              wrapper.style.backgroundColor = isMe ? '#8a2be2' : '#ffffff';
              wrapper.style.boxShadow = 'none';
            }

            previewBody.appendChild(messageClone);
          }
        });

        previewBox.appendChild(previewBody);
        tempContainer.appendChild(previewBox);
        document.body.appendChild(tempContainer);

        await new Promise((resolve) => setTimeout(resolve, 50));

        const exportScale = Math.max(Math.ceil(window.devicePixelRatio || 1) * 2, 3);
        const canvas = await html2canvas(tempContainer, {
          scale: exportScale,
          backgroundColor: '#e9e9e9',
          useCORS: true,
          allowTaint: true,
          logging: false
        });

        document.body.removeChild(tempContainer);

        const dataUrl = canvas.toDataURL('image/png');
        pageImages.push(dataUrl);
      }

      if (pageImages.length === 1) {
        const link = document.createElement('a');
        link.download = `chat_${title.toLowerCase().replace(/\s+/g, '_') || 'export'}.png`;
        link.href = pageImages[0];
        link.click();
      } else {
        setExportProgress(language === 'jp' ? 'ZIPファイルを作成中...' : 'Creating ZIP file...');
        pageImages.forEach((imgUrl, i) => {
          const base64Data = imgUrl.split(',')[1];
          zip.file(`chat_part_${i + 1}.png`, base64Data, { base64: true });
        });

        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const link = document.createElement('a');
        link.download = `chat_${title.toLowerCase().replace(/\s+/g, '_') || 'export'}.zip`;
        link.href = URL.createObjectURL(zipBlob);
        link.click();
      }

      setExportProgress('');
      setIsExporting(false);
    } catch (err) {
      console.error('Export failed:', err);
      alert(language === 'jp' ? 'エクスポートに失敗しました。' : 'Export failed.');
      setIsExporting(false);
    }
  };

  // Derive initials for custom character live preview
  const nameParts = customName.trim().split(/\s+/);
  const defaultInit = nameParts.length > 1
    ? nameParts.map(part => part[0] || '').join('').toUpperCase()
    : (customName.trim() ? customName.trim()[0].toUpperCase() : '?');

  const previewInitials = customInitials.trim() || defaultInit || '?';

  const isJp = language === 'jp';
  const activeSender = getCharacter(getActiveSenderId());

  return (
    <div className="app-container">
      {/* Loading Overlay */}
      {isExporting && (
        <div className="export-loading-overlay">
          <Loader2 className="animate-spin" size={48} color="#8a2be2" />
          <h2>{exportProgress}</h2>
        </div>
      )}

      {/* Main Unified Simulator Box Layout */}
      <div className="unified-simulator-box">

        {/* TOP: Chat Preview Area */}
        <div className="chat-preview-box">
          {/* Header */}
          <div className="chat-preview-header">
            <button className="preview-back-btn" aria-label="Back">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              </svg>
            </button>

            <div className="header-titles">
              <h1 className="header-title">{title || (isJp ? '無題のチャット' : 'Untitled Chat')}</h1>
              <p className="header-subtitle">{subtitle || (isJp ? 'サブタイトルなし' : 'No Subtitle')}</p>
            </div>

            {speakerObjects.length > 0 && (
              <div className="header-participants">
                <div className="avatar-overlap-group">
                  {top3Speakers.map((char, index) => (
                    <div
                      key={char.id}
                      className="participant-avatar-wrapper"
                      style={{
                        zIndex: 10 - index,
                        marginLeft: index > 0 ? '-10px' : '0px',
                      }}
                    >
                      {renderAvatar(char, 'avatar-mini')}
                    </div>
                  ))}
                </div>
                {remainingCount > 0 && (
                  <span className="remaining-count">+{remainingCount}</span>
                )}
              </div>
            )}
          </div>

          {/* Timeline Messages Area */}
          <div className="chat-preview-body">
            {messages.length === 0 ? (
              <div className="empty-chat-hint">
                <p>{isJp ? 'メッセージがありません。下の入力フォームからメッセージを送信してください。' : 'No messages yet. Send a message below.'}</p>
              </div>
            ) : (
              <div className="chat-messages-container">
                {messages.map((msg, index) => {
                  const char = getCharacter(msg.senderId);
                  if (!char) return null;

                  const isMe = msg.senderId === recipientId;
                  const prevMsg = index > 0 ? messages[index - 1] : null;
                  const nextMsg = index < messages.length - 1 ? messages[index + 1] : null;
                  const showSenderInfo = !prevMsg || prevMsg.senderId !== msg.senderId;
                  const isFollowedBySame = nextMsg && nextMsg.senderId === msg.senderId;

                  const isSticker = msg.messageType === 'stamp';
                  const stickerKey = msg.message.replace(/:/g, '');
                  const sticker = isSticker ? STICKERS[stickerKey] : null;
                  const isEditing = editingId === msg.id;

                  return (
                    <div
                      key={msg.id}
                      className={`chat-preview-message ${isMe ? 'is-me' : 'is-other'} ${!showSenderInfo ? 'stacked-message' : ''
                        } ${isFollowedBySame ? 'followed-by-same' : ''} relative-message-row`}
                    >
                      {/* Left Hover Actions for Senders on the Right / Others */}
                      <div className={`message-hover-actions ${isMe ? 'actions-right' : 'actions-left'}`}>
                        {!isEditing && (
                          <>
                            <button
                              onClick={() => startEditing(msg)}
                              className="bubble-action-btn edit"
                              title={isJp ? '編集' : 'Edit'}
                            >
                              <Edit3 size={11} />
                            </button>
                            <button
                              onClick={() => moveMessage(index, -1)}
                              disabled={index === 0}
                              className="bubble-action-btn move"
                              title={isJp ? '上に移動' : 'Move Up'}
                            >
                              ↑
                            </button>
                            <button
                              onClick={() => moveMessage(index, 1)}
                              disabled={index === messages.length - 1}
                              className="bubble-action-btn move"
                              title={isJp ? '下に移動' : 'Move Down'}
                            >
                              ↓
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => deleteMessage(msg.id)}
                          className="bubble-action-btn delete"
                          title={isJp ? '削除' : 'Delete'}
                        >
                          <X size={11} />
                        </button>
                      </div>

                      {/* Left Avatar for others */}
                      {!isMe && showSenderInfo && (
                        <div className="message-avatar-container">
                          {renderAvatar(char, 'avatar-normal')}
                        </div>
                      )}

                      <div className="message-bubble-column">
                        {/* Sender Name */}
                        {showSenderInfo && (
                          <span className="message-sender-name">
                            {isJp ? char.nameJp : char.name}
                          </span>
                        )}

                        {/* Inline editing overlay */}
                        {isEditing ? (
                          <div className="inline-bubble-edit">
                            <input
                              type="text"
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              className="inline-bubble-input"
                              onKeyDown={(e) => e.key === 'Enter' && saveEdit(msg.id)}
                              autoFocus
                            />
                            <button onClick={() => saveEdit(msg.id)} className="inline-save-btn">
                              <Check size={12} />
                            </button>
                            <button onClick={() => setEditingId(null)} className="inline-cancel-btn">
                              <X size={12} />
                            </button>
                          </div>
                        ) : (
                          <>
                            {/* Sticker stamp render */}
                            {isSticker && sticker ? (
                              <div className="message-sticker-wrapper">
                                {sticker.render(120)}
                              </div>
                            ) : (
                              <div className="message-bubble-wrapper">
                                <div className="message-bubble-text">{msg.message}</div>
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      {/* Right Avatar for me */}
                      {isMe && showSenderInfo && (
                        <div className="message-avatar-container">
                          {renderAvatar(char, 'avatar-normal')}
                        </div>
                      )}
                    </div>
                  );
                })}


                <div ref={previewEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM: Integrated Composer Panel */}
        <div className="simulator-input-panel">

          {/* Main Input Row */}
          <form onSubmit={handleAddMessage} className="unified-input-row">

            {/* Speaker Select Button & Dropdown */}
            <div className="dropdown-speaker-container" ref={speakerDropdownRef}>
              <button
                type="button"
                className="speaker-dropdown-trigger"
                onClick={() => setShowSpeakerDropdown(!showSpeakerDropdown)}
                title={isJp ? '発言者を選択' : 'Select Speaker'}
              >
                {activeSender ? renderAvatar(activeSender, 'avatar-mini') : <Plus size={16} />}
                <ChevronDown size={14} className="chevron-icon" />
              </button>

              {showSpeakerDropdown && (
                <div className="speaker-dropdown-list">
                  <div className="dropdown-search-header">{isJp ? '発言者を選択' : 'Select Speaker'}</div>
                  <div className="dropdown-items-scroller">
                    {/* Add Custom Character trigger as first item */}
                    <button
                      type="button"
                      className="dropdown-item add-custom-trigger"
                      onClick={() => {
                        setShowAddCustom(true);
                        setShowSpeakerDropdown(false);
                      }}
                      style={{ borderBottom: '1px dashed #cbd1da', marginBottom: '4px' }}
                    >
                      <div className="avatar-fallback avatar-mini" style={{ backgroundColor: '#8a2be2', color: '#fff', fontWeight: 'bold' }}>
                        +
                      </div>
                      <span style={{ fontWeight: 'bold', color: '#8a2be2' }}>
                        {isJp ? 'カスタムキャラを追加...' : 'Add Custom Character...'}
                      </span>
                    </button>

                    {allCharacters.map((c) => {
                      const isCustom = c.id.startsWith('custom_');
                      return (
                        <div key={c.id} className="dropdown-item-wrapper" style={{ position: 'relative' }}>
                          <button
                            type="button"
                            className={`dropdown-item ${getActiveSenderId() === c.id ? 'active' : ''}`}
                            onClick={() => {
                              setCurrentSenderId(c.id);
                              setShowSpeakerDropdown(false);
                            }}
                            style={{ paddingRight: isCustom ? '36px' : '12px' }}
                          >
                            {renderAvatar(c, 'avatar-mini')}
                            <span>{isJp ? c.nameJp : c.name}</span>
                          </button>
                          {isCustom && (
                            <button
                              type="button"
                              className="delete-custom-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteCustomCharacter(c.id, isJp ? c.nameJp : c.name);
                              }}
                              title={isJp ? '削除' : 'Delete'}
                            >
                              <X size={14} />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Message input text area */}
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder={isJp ? 'メッセージを入力してください...' : 'Type message here...'}
              className="composer-text-input"
            />

            {/* Send Text Button */}
            <button type="submit" className="btn-send-message">
              <Send size={18} />
            </button>
          </form>

          {/* Sub-inputs: Toggles & Toolbar */}
          <div className="input-toolbar-layout">

            {/* Toggle IsMe Switch */}
            <div className="is-me-switch-row">
              <label className="toggle-switch-container">
                <input
                  type="checkbox"
                  checked={isMeToggle}
                  onChange={(e) => setIsMeToggle(e.target.checked)}
                />
                <span className="slider-switch"></span>
              </label>
              <span className="toggle-label">
                {isJp
                  ? `「${getCharacter(recipientId)?.nameJp || 'あなた'}」として送信`
                  : `Send as ${getCharacter(recipientId)?.name || 'You'}`}
              </span>
            </div>

            {/* Quick Actions Buttons toolbar */}
            <div className="utility-buttons-row">
              <button
                ref={settingsButtonRef}
                type="button"
                className={`util-btn ${showSettings ? 'active' : ''}`}
                onClick={() => {
                  setShowSettings(!showSettings);
                  setShowStickers(false);
                }}
                title={isJp ? '設定' : 'Settings'}
              >
                <Settings size={18} />
              </button>

              <button
                type="button"
                className="util-btn delete"
                onClick={clearAll}
                disabled={messages.length === 0}
                title={isJp ? 'チャットをクリア' : 'Clear Chat'}
              >
                <Trash size={18} />
              </button>

              <button
                type="button"
                className="util-btn download"
                onClick={runExportFlow}
                disabled={messages.length === 0}
                title={isJp ? '書き出し' : 'Export Chat'}
              >
                <Download size={18} />
              </button>

              {/* Sticker button hidden for now */}
            </div>
          </div>

          {/* Collapsible Drawers */}

          {/* Drawer 1: Settings Panel */}
          {showSettings && (
            <div ref={settingsDrawerRef} className="drawer-panel settings-drawer">
              <h3>{isJp ? 'チャット設定' : 'Chat Configuration'}</h3>

              <div className="drawer-field">
                <label>{isJp ? 'チャットのタイトル' : 'Chat Title'}</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={isJp ? 'タイトルを入力...' : 'Enter title...'}
                />
              </div>

              <div className="drawer-field">
                <label>{isJp ? 'チャットのサブタイトル' : 'Chat Subtitle'}</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder={isJp ? 'サブタイトルを入力...' : 'Enter subtitle...'}
                />
              </div>

              <div className="drawer-config-row">
                <div className="drawer-field">
                  <label>{isJp ? '受信者 (あなた)' : 'Recipient (You)'}</label>
                  <select
                    value={recipientId}
                    onChange={(e) => setRecipientId(e.target.value)}
                  >
                    {allCharacters.map((c) => (
                      <option key={c.id} value={c.id}>
                        {isJp ? c.nameJp : c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="drawer-field lang-selector-group">
                  <label>{isJp ? '表示言語' : 'Display Language'}</label>
                  <button
                    type="button"
                    className="drawer-lang-btn"
                    onClick={() => setLanguage(isJp ? 'en' : 'jp')}
                  >
                    <Globe size={16} />
                    <span>{isJp ? '日本語 (JP)' : 'English (EN)'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Stickers drawer hidden for now */}

          {/* Drawer 3: Add Custom Character Drawer */}
          {showAddCustom && (
            <div ref={customDrawerRef} className="drawer-panel custom-character-drawer">
              <h3>{isJp ? 'カスタムキャラを追加' : 'Add Custom Character'}</h3>

              <div className="drawer-field">
                <label>{isJp ? '名前' : 'Name'}</label>
                <input
                  type="text"
                  value={customName}
                  onChange={handleCustomNameChange}
                  placeholder={isJp ? '例: ジャック' : 'e.g. Jack'}
                  required
                />
              </div>

              <div className="drawer-field">
                <label>{isJp ? 'アイコン表示方法' : 'Avatar Display Method'}</label>
                <div className="avatar-source-toggle" style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <button
                    type="button"
                    className={`source-toggle-btn ${avatarSourceType === 'initials' ? 'active' : ''}`}
                    onClick={() => setAvatarSourceType('initials')}
                  >
                    {isJp ? 'イニシャル' : 'Initials Only'}
                  </button>
                  <button
                    type="button"
                    className={`source-toggle-btn ${avatarSourceType === 'file' ? 'active' : ''}`}
                    onClick={() => setAvatarSourceType('file')}
                  >
                    {isJp ? 'ファイル選択' : 'Upload File'}
                  </button>
                  <button
                    type="button"
                    className={`source-toggle-btn ${avatarSourceType === 'url' ? 'active' : ''}`}
                    onClick={() => setAvatarSourceType('url')}
                  >
                    {isJp ? '画像URL' : 'Image URL'}
                  </button>
                </div>

                {avatarSourceType === 'file' && (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarFileChange}
                    onClick={() => setIsFilePickerActive(true)}
                    className="file-input-field"
                    style={{ fontSize: '0.85rem' }}
                  />
                )}

                {avatarSourceType === 'url' && (
                  <input
                    type="text"
                    value={customAvatarUrl}
                    onChange={(e) => setCustomAvatarUrl(e.target.value)}
                    placeholder="https://example.com/avatar.png"
                    className="url-input-field"
                  />
                )}
              </div>

              {/* Show Initials inputs and Color picker only if they decide to use Initials display */}
              {avatarSourceType === 'initials' && (
                <div className="drawer-config-row">
                  <div className="drawer-field">
                    <label>{isJp ? 'イニシャル' : 'Initials'}</label>
                    <input
                      type="text"
                      value={customInitials}
                      onChange={(e) => setCustomInitials(e.target.value)}
                      placeholder={isJp ? '例: J' : 'e.g. J'}
                      maxLength={3}
                    />
                  </div>

                  <div className="drawer-field">
                    <label>{isJp ? 'カラー' : 'Color'}</label>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input
                        type="color"
                        value={customColor}
                        onChange={(e) => setCustomColor(e.target.value)}
                        style={{ width: '40px', height: '40px', padding: '0', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}
                      />
                      <span style={{ fontSize: '0.85rem', color: '#555', fontFamily: 'monospace' }}>{customColor}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Preview of the custom character */}
              <div className="custom-character-preview-section">
                <span className="preview-title">{isJp ? 'プレビュー:' : 'Preview:'}</span>
                <div className="preview-avatar-wrapper">
                  <div className="message-avatar-container">
                    {(() => {
                      const mockChar = {
                        name: customName || '?',
                        nameJp: customName || '?',
                        color: customColor,
                        avatar: avatarSourceType === 'file' ? customAvatarFile : (avatarSourceType === 'url' ? customAvatarUrl : null),
                        initialsEn: previewInitials,
                        initialsJp: previewInitials
                      };
                      return renderAvatar(mockChar, 'avatar-normal');
                    })()}
                  </div>
                  <div className="preview-text-col">
                    <h5 className="preview-name">{customName || (isJp ? '名前未入力' : 'Unnamed')}</h5>
                  </div>
                </div>
              </div>

              <div className="drawer-actions">
                <button
                  type="button"
                  className="drawer-btn cancel"
                  onClick={() => {
                    setShowAddCustom(false);
                    // Reset inputs
                    setCustomName('');
                    setCustomInitialsEn('');
                    setCustomInitialsJp('');
                    setCustomAvatarFile('');
                    setCustomAvatarUrl('');
                    setCustomColor('#8a2be2');
                  }}
                >
                  {isJp ? 'キャンセル' : 'Cancel'}
                </button>
                <button
                  type="button"
                  className="drawer-btn save"
                  onClick={handleCreateCustomCharacter}
                  disabled={!customName.trim()}
                >
                  {isJp ? '作成' : 'Create'}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Page Footer */}
      <footer className="app-footer">
        <span>created by Nisie | カニシズ</span>
        <a href="https://x.com/qkz_iroiro" target="_blank" rel="noopener noreferrer" className="footer-x-link" title="X Account">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" style={{ verticalAlign: 'middle' }}>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </a>
      </footer>

      {/* Delete Confirmation Modal Dialog */}
      {deleteConfirmTarget && (
        <div className="modal-overlay" onClick={() => setDeleteConfirmTarget(null)}>
          <div className="modal-dialog delete-confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <h4>{isJp ? 'キャラクターを削除' : 'Delete Character'}</h4>
            <p>
              {isJp 
                ? `「${deleteConfirmTarget.name}」を本当に完全に削除しますか？` 
                : `Are you sure you want to permanently delete custom character "${deleteConfirmTarget.name}"?`}
            </p>
            <div className="modal-actions">
              <button
                type="button"
                className="modal-btn cancel"
                onClick={() => setDeleteConfirmTarget(null)}
              >
                {isJp ? 'キャンセル' : 'Cancel'}
              </button>
              <button
                type="button"
                className="modal-btn confirm"
                onClick={() => {
                  const id = deleteConfirmTarget.id;
                  const updatedList = customCharacters.filter(c => c.id !== id);
                  setCustomCharacters(updatedList);
                  localStorage.setItem('ninechat_custom_characters', JSON.stringify(updatedList));

                  // Reset active selections if the character was deleted
                  if (currentSenderId === id) {
                    setCurrentSenderId(staticCharacters[0].id);
                  }
                  if (recipientId === id) {
                    setRecipientId(staticCharacters[0].id);
                  }

                  setDeleteConfirmTarget(null);
                  setShowSpeakerDropdown(false);
                }}
              >
                {isJp ? '削除' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear Messages Confirmation Modal Dialog */}
      {showClearConfirm && (
        <div className="modal-overlay" onClick={() => setShowClearConfirm(false)}>
          <div className="modal-dialog delete-confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <h4>{isJp ? 'チャットをクリア' : 'Clear Chat'}</h4>
            <p>
              {isJp 
                ? 'メッセージをすべて削除しますか？' 
                : 'Are you sure you want to clear all messages?'}
            </p>
            <div className="modal-actions">
              <button
                type="button"
                className="modal-btn cancel"
                onClick={() => setShowClearConfirm(false)}
              >
                {isJp ? 'キャンセル' : 'Cancel'}
              </button>
              <button
                type="button"
                className="modal-btn confirm"
                onClick={() => {
                  setMessages([]);
                  setShowClearConfirm(false);
                }}
              >
                {isJp ? 'クリア' : 'Clear'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
