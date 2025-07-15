import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';  // Updated import
import SafeIcon from '../common/SafeIcon';
import { FiMail, FiLock, FiAlertCircle } from 'react-icons/fi';

// Rest of the LoginForm code remains the same...