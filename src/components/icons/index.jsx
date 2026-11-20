import React from 'react';

const base = ({ className = '', ...props }, children) => {
  const hasColor = /\btext-/.test(className);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
      className={`${hasColor ? '' : 'text-green-600 '}${className}`.trim()}
    >
      {children}
    </svg>
  );
};

export const Home = (props) => base(props, <><path d="M3 10.5L12 3l9 7.5"/><path d="M5 9.5V20h14V9.5"/><path d="M9 20v-6h6v6"/></>);
export const Search = (props) => base(props, <><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></>);
export const LogOut = (props) => base(props, <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></>);
export const Shield = (props) => base(props, <><path d="M12 3l8 4v5c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V7l8-4z"/><path d="M9 12l2 2 4-4"/></>);
export const Building2 = (props) => base(props, <><rect x="3" y="3" width="8" height="18" rx="1"/><rect x="13" y="8" width="8" height="13" rx="1"/><path d="M6 7h2M6 11h2M6 15h2M16 12h2M16 16h2"/></>);
export const Building = Building2;
export const Menu = (props) => base(props, <><path d="M4 6h16M4 12h16M4 18h16"/></>);
export const X = (props) => base(props, <><path d="M18 6L6 18M6 6l12 12"/></>);
export const Briefcase = (props) => base(props, <><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M3 13h18"/></>);
export const Megaphone = (props) => base(props, <><path d="M3 11l14-5v12L3 13v-2z"/><path d="M11 6v12"/><path d="M7 14v4a2 2 0 0 0 2 2h1"/></>);
export const DollarSign = (props) => base(props, <><path d="M12 2v20"/><path d="M17 6.5c0-1.93-2.24-3.5-5-3.5S7 4.57 7 6.5 9.24 10 12 10s5 1.57 5 3.5S14.76 17 12 17s-5-1.57-5-3.5"/></>);
export const Phone = (props) => base(props, <><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.91a16 16 0 0 0 6 6l1.45-1.23a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92z"/></>);
export const Mail = (props) => base(props, <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></>);
export const MapPin = (props) => base(props, <><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></>);
export const Clock = (props) => base(props, <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>);
export const Globe = (props) => base(props, <><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a15 15 0 0 1 0 18"/><path d="M12 3a15 15 0 0 0 0 18"/></>);
export const Languages = (props) => base(props, <><path d="M5 8l6 6"/><path d="M4 14h6"/><path d="M2 5h12"/><path d="M7 2v3"/><path d="M22 22l-5-10-5 10"/><path d="M14 18h6"/></>);
export const CheckCircle2 = (props) => base(props, <><circle cx="12" cy="12" r="9"/><path d="M8.5 12.5l2.5 2.5 4.5-5"/></>);
export const CheckCircle = CheckCircle2;
export const Image = (props) => base(props, <><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9" r="1.5"/><path d="M21 16l-5-5-4 4-2-2-5 5"/></>);
export const PlayCircle = (props) => base(props, <><circle cx="12" cy="12" r="9"/><path d="M10 8.5l6 3.5-6 3.5z" fill="currentColor" stroke="none"/></>);
export const ArrowLeft = (props) => base(props, <><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></>);
export const ChevronLeft = (props) => base(props, <><path d="M15 18l-6-6 6-6"/></>);
export const ChevronRight = (props) => base(props, <><path d="M9 18l6-6-6-6"/></>);
export const ArrowUp = (props) => base(props, <><path d="M18 15l-6-6-6 6"/><path d="M12 3v18"/></>);
export const LayoutDashboard = (props) => base(props, <><rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="5" rx="1"/><rect x="13" y="10" width="8" height="11" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/></>);
export const Users = (props) => base(props, <><circle cx="9" cy="8" r="3"/><path d="M3 20v-1a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v1"/><circle cx="17" cy="9" r="2.5"/><path d="M17 14a4 4 0 0 1 4 4v2"/></>);
export const User = (props) => base(props, <><circle cx="12" cy="8" r="4"/><path d="M4 20a8 8 0 0 1 16 0"/></>);
export const XCircle = (props) => base(props, <><circle cx="12" cy="12" r="9"/><path d="M15 9l-6 6M9 9l6 6"/></>);
export const CreditCard = (props) => base(props, <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/><path d="M7 15h4"/></>);
export const FileText = (props) => base(props, <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h6"/></>);
export const Settings = (props) => base(props, <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1 1 0 0 0 .2 1.1l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9V20a2 2 0 1 1-4 0v-.1a1 1 0 0 0-.7-.9 1 1 0 0 0-1.1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1 1 0 0 0 .2-1.1 1 1 0 0 0-.9-.6H4a2 2 0 1 1 0-4h.1a1 1 0 0 0 .9-.7 1 1 0 0 0-.2-1.1l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1 1 0 0 0 1.1.2h.1a1 1 0 0 0 .6-.9V4a2 2 0 1 1 4 0v.1a1 1 0 0 0 .6.9 1 1 0 0 0 1.1-.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1 1 0 0 0-.2 1.1v.1a1 1 0 0 0 .9.6H20a2 2 0 1 1 0 4h-.1a1 1 0 0 0-.9.6z"/></>);
export const Plus = (props) => base(props, <><path d="M12 5v14M5 12h14"/></>);
export const Eye = (props) => base(props, <><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z"/><circle cx="12" cy="12" r="3"/></>);
export const EyeOff = (props) => base(props, <><path d="M3 3l18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.1A10.9 10.9 0 0 1 12 5c6.5 0 10 7 10 7a17.5 17.5 0 0 1-4.1 4.9"/><path d="M6.6 6.6C4 8.4 2 12 2 12s3.5 7 10 7c1.7 0 3.2-.4 4.5-1"/></>);
export const Trash2 = (props) => base(props, <><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></>);
export const Download = (props) => base(props, <><path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M5 21h14"/></>);
export const Calendar = (props) => base(props, <><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></>);
export const ExternalLink = (props) => base(props, <><path d="M14 3h7v7"/><path d="M10 14L21 3"/><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/></>);
export const Tag = (props) => base(props, <><path d="M20.59 13.41L12 22l-9-9V4h9z"/><circle cx="7.5" cy="7.5" r="1.5"/></>);
export const Sparkles = (props) => base(props, <><path d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3z"/><path d="M19 14l.8 1.8L22 16.5l-2.2.7L19 19l-.8-1.8-2.2-.7 2.2-.7.8-1.8z"/><path d="M5 15l.6 1.4L7 17l-1.4.6L5 19l-.6-1.4L3 17l1.4-.6L5 15z"/></>);
export const MessageSquare = (props) => base(props, <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M14 9h-4M14 13h-4"/></>);
export const Send = (props) => base(props, <><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></>);
export const Smartphone = (props) => base(props, <><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/></>);
export const Landmark = (props) => base(props, <><path d="M3 21h18"/><path d="M4 17h16"/><path d="M12 3L3 8h18L12 3z"/><path d="M6 17v-6M10 17v-6M14 17v-6M18 17v-6"/></>);
export const Car = (props) => base(props, <><path d="M5 11l1.5-4.5A2 2 0 0 1 8.4 5h7.2a2 2 0 0 1 1.9 1.5L19 11"/><path d="M3 11h18v5H3z"/><circle cx="7.5" cy="16" r="1.5"/><circle cx="16.5" cy="16" r="1.5"/><path d="M5 16H3M21 16h-2"/></>);
export const Lock = (props) => base(props, <><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 1 1 8 0v3"/></>);
export const Facebook = ({ className = '', ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props} className={className}>
    <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z"/>
  </svg>
);
export const Twitter = ({ className = '', ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props} className={className}>
    <path d="M18.244 2H21.5l-7.116 8.134L22.75 22h-6.554l-5.134-6.708L5.186 22H1.928l7.612-8.7L1.25 2h6.722l4.64 6.134L18.244 2zm-1.15 17.966h1.804L6.99 3.928H5.054l12.04 16.038z"/>
  </svg>
);
export const Instagram = ({ className = '', ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props} className={className}>
    <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.8A3.95 3.95 0 0 0 3.8 7.75v8.5a3.95 3.95 0 0 0 3.95 3.95h8.5a3.95 3.95 0 0 0 3.95-3.95v-8.5a3.95 3.95 0 0 0-3.95-3.95h-8.5zm8.9 1.35a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4z"/>
  </svg>
);
export const Linkedin = ({ className = '', ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props} className={className}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.476-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.555V9h3.564v11.452z"/>
  </svg>
);
export const LinkedIn = Linkedin;

export default {
  Home, Search, LogOut, Shield, Building2, Building, Menu, X, Briefcase, Megaphone,
  DollarSign, Phone, Mail, MapPin, Clock, Globe, Languages, CheckCircle2, CheckCircle, Image, PlayCircle,
  ArrowLeft, ChevronLeft, ChevronRight, ArrowUp, LayoutDashboard, Users, User, XCircle, CreditCard,
  FileText, Settings, Plus, Eye, EyeOff, Trash2, Download, Calendar, ExternalLink, Tag,
  Sparkles, MessageSquare, Send, Smartphone, Landmark, Car, Lock, Facebook, Twitter, Instagram, Linkedin, LinkedIn,
};
