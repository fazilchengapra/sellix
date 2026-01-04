import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Browse', path: '/' },
    { name: 'Cart', path: '/cart' },
    { name: 'Wishlist', path: '/wishlist' },
  ];

  const supportLinks = [
    { name: 'About Us', path: '#' },
    { name: 'Contact', path: '#' },
    { name: 'Privacy Policy', path: '#' },
    { name: 'Terms of Service', path: '#' },
  ];

  const socialLinks = [
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Mail, href: '#', label: 'Email' },
  ];

  return (
    
       (
                
          

          {/* Quick Links */}
          
            Quick Links
            
              {quickLinks.map(({ name, path }) => (
                
                  
          

          {/* Support */}
          
            Support
            
              {supportLinks.map(({ name, path }) => (
                
                  
          

          {/* Newsletter */}
          
            Newsletter
            
              Subscribe to get special offers and updates.
            
            
              
              
                Subscribe
              
            
          
        

        {/* Copyright */}
        
          &copy; {currentYear} Sellix. All rights reserved.
        
      
    
  );
};

export default Footer;
