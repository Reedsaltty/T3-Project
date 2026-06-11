import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Mail, MapPin, Phone, Send, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState("idle");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setStatus("sending");
    setTimeout(() => {
      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setStatus("idle"), 3000);
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      
      <main className="flex-1">
        {/* Header */}
        <section className="pt-20 pb-12 md:pt-28 md:pb-16 bg-gray-50/50 border-b border-gray-100">
          <div className="container mx-auto px-6 max-w-4xl text-center">
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-gray-900 tracking-tight mb-4">
                Get in Touch
              </h1>
              <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                Have questions about Hoop, need help with your event, or want to explore enterprise options? We're here to help.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
              
              {/* Contact Info */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ duration: 0.5, delay: 0.1 }}
                className="lg:col-span-2 flex flex-col gap-10"
              >
                <div>
                  <h3 className="text-2xl font-heading font-bold text-gray-900 mb-6">Contact Information</h3>
                  <div className="flex flex-col gap-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                        <Mail size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Email Us</p>
                        <p className="text-sm text-gray-500 mt-1">Our friendly team is here to help.</p>
                        <a href="mailto:hello@hoop.app" className="text-sm font-semibold text-blue-600 mt-1 hover:underline inline-block">hello@hoop.app</a>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                        <MapPin size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Visit Us</p>
                        <p className="text-sm text-gray-500 mt-1">Come say hello at our office HQ.</p>
                        <p className="text-sm text-gray-900 mt-1">100 Tech Lane, Suite 400<br/>San Francisco, CA 94105</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                        <Phone size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Call Us</p>
                        <p className="text-sm text-gray-500 mt-1">Mon-Fri from 8am to 5pm PST.</p>
                        <a href="tel:+18001234567" className="text-sm font-semibold text-gray-900 mt-1 hover:text-blue-600 inline-block">+1 (800) 123-4567</a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-3 mb-3">
                    <MessageCircle className="text-blue-600" size={24} />
                    <h4 className="font-semibold text-gray-900">Live Support</h4>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">Our support team usually responds within 2 hours during business days.</p>
                  <Button variant="outline" className="w-full bg-white">Open Chat Support</Button>
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ duration: 0.5, delay: 0.2 }}
                className="lg:col-span-3"
              >
                <div className="bg-white p-8 md:p-10 rounded-3xl border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                  <h3 className="text-2xl font-heading font-bold text-gray-900 mb-6">Send us a message</h3>
                  
                  <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">First & Last Name <span className="text-red-500">*</span></Label>
                        <Input 
                          id="name" 
                          placeholder="Jane Doe" 
                          required 
                          value={formData.name} 
                          onChange={e => setFormData(f => ({ ...f, name: e.target.value }))}
                          className="h-12 bg-gray-50/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="jane@example.com" 
                          required 
                          value={formData.email} 
                          onChange={e => setFormData(f => ({ ...f, email: e.target.value }))}
                          className="h-12 bg-gray-50/50"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input 
                        id="subject" 
                        placeholder="How can we help you?" 
                        value={formData.subject} 
                        onChange={e => setFormData(f => ({ ...f, subject: e.target.value }))}
                        className="h-12 bg-gray-50/50"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">Message <span className="text-red-500">*</span></Label>
                      <Textarea 
                        id="message" 
                        placeholder="Please describe your inquiry in detail..." 
                        required 
                        rows={5}
                        value={formData.message} 
                        onChange={e => setFormData(f => ({ ...f, message: e.target.value }))}
                        className="resize-y min-h-[150px] bg-gray-50/50"
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      size="lg" 
                      disabled={status === "sending" || status === "success"}
                      className={`h-12 w-full sm:w-auto sm:self-start gap-2 ${status === "success" ? "bg-emerald-500 hover:bg-emerald-600" : ""}`}
                    >
                      {status === "idle" && <><Send size={16} /> Send Message</>}
                      {status === "sending" && "Sending..."}
                      {status === "success" && "Message Sent!"}
                    </Button>
                  </form>
                </div>
              </motion.div>

            </div>
          </div>
        </section>

      </main>
      
      <Footer />
    </div>
  );
}
