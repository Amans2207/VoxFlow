"use client";

import React from 'react';
import { useAI } from '@/context/AIContext';
import AIProgress from './AIProgress';

export default function AIProgressWrapper() {
  const { isProcessing, message } = useAI();
  return <AIProgress isVisible={isProcessing} message={message} />;
}
