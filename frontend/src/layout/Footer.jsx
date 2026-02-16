import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, SendHorizontal } from 'lucide-react';
import { FooterLink, FooterSection } from '../components/FooterSection';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-black py-4 text-white">
      <div className="mx-auto max-w-7xl px-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">

        {/* Brand / Subscribe */}
        <div className="flex flex-col gap-2">
          <Link to={"/"}>
            <h2 className="text-xl font-bold tracking-wider">TechVerse</h2>
          </Link>
          <h3 className="text-sm font-medium">Subscribe</h3>
          <p className="text-sm font-light">Get 10% off your first order</p>
          <div className="relative max-w-[200px]">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full bg-transparent border border-white rounded py-2 pl-3 pr-9 text-sm text-white placeholder:text-white/50 focus:outline-none"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2">
              <SendHorizontal size={16} />
            </button>
          </div>
        </div>

        {/* Support */}
        <FooterSection title="Support">
          <p className="text-sm leading-5">Kapan, Kathmandu</p>
          <FooterLink href="mailto:easymart@gmail.com">techverse@gmail.com</FooterLink>
          <FooterLink href="tel:+977974125010">+977 974125010</FooterLink>
        </FooterSection>

        {/* Account */}
        <FooterSection title="Account">
          <FooterLink>My Account</FooterLink>
          <FooterLink>Login / Register</FooterLink>
          <FooterLink>Cart</FooterLink>
          <FooterLink>Wishlist</FooterLink>
          <FooterLink>Shop</FooterLink>
        </FooterSection>

        {/* Quick Link */}
        <FooterSection title="Quick Link">
          <FooterLink>Privacy Policy</FooterLink>
          <FooterLink>Terms Of Use</FooterLink>
          <FooterLink>FAQ</FooterLink>
          <FooterLink>Contact</FooterLink>
        </FooterSection>

        {/* Download App */}
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-bold">Our Social Handle</h3>

          <div className="flex gap-4 mt-2">
            <Link to="https:///www.instagram.com">
              <Facebook target='_blank' size={20} className="cursor-pointer hover:text-gray-400" />
            </Link>

            <Link to="https:///www.instagram.com">
              <Twitter target='_blank' size={20} className="cursor-pointer hover:text-gray-400" />
            </Link>

            <Link target='_blank' to="https:///www.instagram.com">
              <Instagram size={20} className="cursor-pointer hover:text-gray-400" />
            </Link>

            <Link target='_blank'  to="https:///www.instagram.com">
              <Linkedin size={20} className="cursor-pointer hover:text-gray-400" />
            </Link>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-4 text-center text-xs text-white/60">
        © Copyright Basant 2026. All rights reserved
      </div>
    </footer>
  );
};

export default Footer;
