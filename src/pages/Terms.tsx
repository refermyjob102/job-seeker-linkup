
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight, Building, FileText } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

const Terms = () => {
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
            <span className="text-foreground">Terms of Service</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-10">
            <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
            <p className="text-muted-foreground">Last updated: May 15, 2023</p>
          </div>

          <div className="prose prose-stone dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Introduction</h2>
              <p>
                Welcome to JobReferral ("Company", "we", "our", "us")! These Terms of Service ("Terms") govern your use of our website and services, including any content, functionality, and services offered on or through our website.
              </p>
              <p>
                By accessing or using our services, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Eligibility</h2>
              <p>
                Our services are available only to individuals who are at least 18 years old. By using our services, you represent and warrant that you are at least 18 years old and that you have the legal capacity to enter into a binding agreement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">User Accounts</h2>
              <h3 className="text-xl font-semibold mt-4 mb-2">Account Creation</h3>
              <p>
                To use certain features of our services, you may need to create a user account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
              </p>
              <h3 className="text-xl font-semibold mt-4 mb-2">Account Security</h3>
              <p>
                You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account or any other breach of security.
              </p>
              <h3 className="text-xl font-semibold mt-4 mb-2">Account Termination</h3>
              <p>
                We reserve the right to suspend or terminate your account at our sole discretion, without notice, for conduct that we determine violates these Terms or is otherwise harmful to other users, us, or third parties, or for any other reason.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">User Content</h2>
              <p>
                You are solely responsible for the content, including but not limited to resumes, cover letters, and professional information, that you submit, post, or display on or through our services ("User Content").
              </p>
              <p>
                By submitting User Content, you grant us a non-exclusive, worldwide, royalty-free, sublicensable, and transferable license to use, reproduce, distribute, prepare derivative works of, display, and perform your User Content in connection with the services and our business.
              </p>
              <p>
                You represent and warrant that your User Content does not violate any third-party rights, including intellectual property rights and privacy rights, and that it complies with all applicable laws and regulations.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Prohibited Activities</h2>
              <p>You agree not to:</p>
              <ul>
                <li>Use our services in any way that violates any applicable law or regulation</li>
                <li>Impersonate any person or entity, or falsely state or otherwise misrepresent your affiliation with a person or entity</li>
                <li>Interfere with or disrupt the services or servers or networks connected to the services</li>
                <li>Attempt to gain unauthorized access to any part of the services, other accounts, or computer systems through hacking, password mining, or any other means</li>
                <li>Use any robot, spider, or other automatic device to access the services for any purpose without our express written permission</li>
                <li>Introduce any viruses, trojan horses, worms, logic bombs, or other malicious or technologically harmful material</li>
                <li>Collect or harvest any information from the services, including user profiles</li>
                <li>Post or transmit any content that is unlawful, fraudulent, threatening, abusive, libelous, defamatory, obscene, or otherwise objectionable</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Intellectual Property</h2>
              <p>
                The services and their original content, features, and functionality are and will remain the exclusive property of JobReferral and its licensors. The services are protected by copyright, trademark, and other laws of both the United States and foreign countries.
              </p>
              <p>
                Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Limitation of Liability</h2>
              <p>
                In no event will JobReferral, its affiliates, or their licensors, service providers, employees, agents, officers, or directors be liable for damages of any kind, under any legal theory, arising out of or in connection with your use or inability to use the services.
              </p>
              <p>
                This includes any direct, indirect, special, incidental, consequential, or punitive damages, including but not limited to, personal injury, pain and suffering, emotional distress, loss of revenue, loss of profits, loss of business or anticipated savings, loss of use, loss of goodwill, loss of data, and whether caused by tort (including negligence), breach of contract, or otherwise, even if foreseeable.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Disclaimer of Warranties</h2>
              <p>
                The services are provided "as is" and "as available" without any representations or warranties, express or implied. JobReferral makes no representations or warranties in relation to the services or the information and materials provided through the services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Changes to These Terms</h2>
              <p>
                We may update these Terms from time to time. We will notify you of any changes by posting the new Terms on this page and updating the "Last updated" date at the top of this page. You are advised to review these Terms periodically for any changes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
              <p>
                If you have any questions or concerns about these Terms, please contact us at:
              </p>
              <p className="mt-2">
                Email: legal@jobreferral.com<br />
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

export default Terms;
