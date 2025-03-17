
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight, Building, Shield } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur-md z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Building className="w-6 h-6 text-primary mr-2" />
              <h1 className="text-xl font-bold">JobReferral</h1>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link to="/login">
              <Button variant="outline" size="sm">
                Log in
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm">Sign up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-muted/30 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-foreground">Privacy Policy</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-10">
            <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: May 15, 2023</p>
          </div>

          <div className="prose prose-stone dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Introduction</h2>
              <p>
                JobReferral ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
              </p>
              <p>
                Please read this Privacy Policy carefully. By accessing or using our services, you acknowledge that you have read, understood, and agree to be bound by all the terms of this Privacy Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Information We Collect</h2>
              <p>
                We collect information that you voluntarily provide to us when you register for an account, express interest in obtaining information about us or our products and services, participate in activities on our services, or otherwise contact us.
              </p>
              <h3 className="text-xl font-semibold mt-4 mb-2">Personal Information</h3>
              <p>The personal information we collect may include:</p>
              <ul>
                <li>Name, email address, phone number, and other contact information</li>
                <li>Job title, employment history, skills, and professional qualifications</li>
                <li>Resume/CV and other documents you upload to our platform</li>
                <li>Account login credentials</li>
                <li>Payment information when you purchase premium services</li>
              </ul>

              <h3 className="text-xl font-semibold mt-4 mb-2">Automatically Collected Information</h3>
              <p>
                When you visit our website or use our services, we automatically collect certain information about your device and your interaction with our services, including:
              </p>
              <ul>
                <li>IP address, browser type, device type, and operating system</li>
                <li>Pages you view, links you click, and actions you take on our services</li>
                <li>Time spent on pages and how you navigate our services</li>
                <li>Information collected through cookies, web beacons, and other tracking technologies</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">How We Use Your Information</h2>
              <p>We may use the information we collect for various purposes, including to:</p>
              <ul>
                <li>Create and manage your account</li>
                <li>Provide the services you request, such as facilitating job referrals</li>
                <li>Connect job seekers with potential referrers</li>
                <li>Process payments and manage subscriptions</li>
                <li>Respond to inquiries and provide customer support</li>
                <li>Send administrative information, such as updates to our terms and policies</li>
                <li>Send marketing and promotional communications with your consent</li>
                <li>Personalize your experience and deliver content relevant to your interests</li>
                <li>Monitor and analyze usage and trends to improve our services</li>
                <li>Protect our services and users from fraudulent, unauthorized, or illegal activity</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Data Retention</h2>
              <p>
                We will retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
              </p>
              <p>
                When we no longer need your personal information, we will securely delete or anonymize it.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Cookies and Tracking Technologies</h2>
              <p>
                We use cookies and similar tracking technologies to collect information about your browsing activities and to better understand how you interact with our services. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Security</h2>
              <p>
                We have implemented appropriate technical and organizational security measures to protect your information from unauthorized access, use, disclosure, alteration, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Your Rights</h2>
              <p>
                Depending on your location, you may have certain rights regarding your personal information, including:
              </p>
              <ul>
                <li>The right to access the personal information we hold about you</li>
                <li>The right to request correction of inaccurate information</li>
                <li>The right to request deletion of your personal information</li>
                <li>The right to withdraw consent to processing, where processing is based on consent</li>
                <li>The right to object to processing for direct marketing purposes</li>
                <li>The right to data portability</li>
              </ul>
              <p>
                To exercise these rights, please contact us at privacy@jobreferral.com.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top of this page. You are advised to review this Privacy Policy periodically for any changes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
              <p>
                If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:
              </p>
              <p className="mt-2">
                Email: privacy@jobreferral.com<br />
                Postal Address: 123 Tech Avenue, San Francisco, CA 94107
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-background py-8 px-4 border-t mt-12">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground mb-4 md:mb-0">
              © 2023 JobReferral. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms</Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Privacy;
