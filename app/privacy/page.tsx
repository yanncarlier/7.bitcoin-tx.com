import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <section className="bg-gray-900 text-white py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-orange-500">
              Privacy Policy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              <section className="flex flex-col gap-4">
                <p>Privacy Policy Last updated March 22, 2025 </p>
                <p>
                  This Privacy Policy explains how data about you is collected,
                  used, and disclosed by Bitcoin-tx Ltd (“Bitcoin-tx,” “we,” or
                  “us”).{" "}
                </p>
                <p>
                  This Privacy Policy (together with our Terms of Service and
                  any other referenced documents) applies to information we
                  collect when you use our websites, mobile applications, APIs,
                  hosted Bitcoin wallet services, and other online products and
                  services (collectively, the “Services”) or when you otherwise
                  interact with us.{" "}
                </p>
                <p>
                  We may update this Privacy Policy periodically. If we make
                  changes, we will notify you by revising the date at the bottom
                  of this policy and, at our discretion, may provide additional
                  notice (e.g., via our website, X posts, or email). We
                  encourage you to review this Privacy Policy regularly when
                  using our Services to stay informed about our data practices
                  and how you can protect your privacy.{" "}
                </p>
                <p>Information We Collect</p>
                <p>Information You Provide</p>
                <p>
                  We collect information you provide directly to us. For
                  example, we log information when you create an account, engage
                  with Service features, fill out forms, initiate Bitcoin
                  transactions via the Services, request support, or communicate
                  with us. This may include:{" "}
                </p>
                <ul>
                  <li>Email address </li>
                  <li>Bitcoin addresses </li>
                  <li>Alias or username </li>
                  <li>
                    Mobile phone number (e.g., for two-factor authentication){" "}
                  </li>
                  <li>Mobile PIN code </li>
                  <li>Any other information you choose to provide</li>
                </ul>
                <p>
                  Additional data may be collected based on your opt-in
                  settings. For instance, if you enable data collection in the
                  app settings, we may pseudonymously gather details about your
                  interactions with our mobile or desktop applications. Learn
                  more about these settings in our Help Center.{" "}
                </p>
                <p>Information We Collect Automatically</p>
                <p>
                  When you use our Services, we collect information about you,
                  including:{" "}
                </p>
                <ul>
                  <li>
                    Login Information: Software version, browser type, access
                    times, pages viewed, IP address, and the page you visited
                    before ours.{" "}
                  </li>
                  <li>
                    Device Information: Hardware model, operating system and
                    version, unique device identifiers, and mobile network
                    details for devices accessing our mobile app.{" "}
                  </li>
                  <li>
                    Cookies and Tracking Technologies: We use cookies and
                    similar tools to enhance your experience, analyze usage, and
                    track visits. Cookies are small files stored on your device.
                    See our Cookie Policy for details on usage and how to
                    disable them.{" "}
                  </li>
                  <li>
                    Wallet Public Information: When you create a Wallet, we
                    generate and store public data like master_public and
                    master_chaincode via our Services.
                  </li>
                </ul>
                <p>Information from Other Sources</p>
                <p>
                  We may combine information from third-party sources with data
                  collected through our Services. Third-party services follow
                  their own privacy policies. For mobile and desktop apps, crash
                  reports may provide technical details (e.g., OS version, app
                  version, stack traces).{" "}
                </p>
                <p>How We Use Your Information</p>
                <p>We may use your information to: </p>
                <ul>
                  <li>Provide, maintain, and enhance our Services </li>
                  <li>
                    Deliver requested services, facilitate Bitcoin transactions,
                    and send related confirmations{" "}
                  </li>
                  <li>
                    Send technical notices, updates, security alerts,
                    authentication codes, and administrative messages{" "}
                  </li>
                  <li>
                    Respond to your inquiries, comments, or support requests{" "}
                  </li>
                  <li>
                    Inform you about products, services, offers, or events from
                    Bitcoin-tx{" "}
                  </li>
                  <li>
                    Analyze trends and usage in an aggregated, anonymous manner{" "}
                  </li>
                  <li>Process contest entries or rewards </li>
                  <li>
                    Combine with third-party data to improve service delivery{" "}
                  </li>
                  <li>
                    Fulfill any purpose for which you provided the information
                  </li>
                </ul>
                <p>
                  If you provide a mobile number for two-factor authentication
                  (2FA), we will not share it with third parties or affiliates
                  for marketing purposes, nor will we share text messaging
                  opt-in data or consent.{" "}
                </p>
                <p>How We Share Your Information</p>
                <p>
                  We may share your information as follows or as described in
                  this Privacy Policy:{" "}
                </p>
                <ul>
                  <li>
                    Bitcoin Network: Public wallet addresses and transaction
                    details to process your transaction requests.{" "}
                  </li>
                  <li>
                    Service Providers: With vendors or consultants who process
                    data on our behalf, required to align with our privacy
                    standards.{" "}
                  </li>
                  <li>
                    Legal Compliance: In response to lawful requests if we
                    believe disclosure is required by applicable law or legal
                    processes.{" "}
                  </li>
                  <li>
                    Safety and Rights: If your actions violate our agreements or
                    policies, or to protect Bitcoin-tx or others’ rights,
                    property, or safety.{" "}
                  </li>
                  <li>
                    Business Transactions: During negotiations of mergers,
                    sales, financing, or acquisitions involving Bitcoin-tx.{" "}
                  </li>
                  <li>
                    With Consent: At your direction or with your consent,
                    including when we notify you of specific sharing practices
                    and you provide the data.
                  </li>
                </ul>
                <p>Managing Your Information</p>
                <p>
                  You may update, correct, or delete your account information by
                  logging into your online account at any time.{" "}
                </p>
                <p>Security</p>
                <p>
                  We implement reasonable measures to protect your information,
                  but no system is fully secure. You are responsible for
                  safeguarding your authentication credentials (e.g., mnemonics,
                  PINs).{" "}
                </p>
                <p>International Data Transfers</p>
                <p>
                  Your information may be processed in jurisdictions outside
                  your own, subject to different data protection laws. By using
                  our Services, you consent to such transfers where legally
                  required.{" "}
                </p>
                <p>Third-Party Links</p>
                <p>
                  Our Services may link to third-party sites or services not
                  controlled by us. Their privacy practices govern any data you
                  provide to them.{" "}
                </p>
                <p>Children’s Privacy</p>
                <p>
                  Our Services are not intended for individuals under 13. We do
                  not knowingly collect data from children under 13. Contact us
                  if you believe we have such data.{" "}
                </p>
                <p>Contact Us</p>
                <p>
                  For questions about this Privacy Policy, contact us at,{" "}
                  <a
                    href="mailto:privacy@bitcoin-tx.com"
                    target="_blank"
                    className="url"
                  >
                    privacy@bitcoin-tx.com
                  </a>
                  .{" "}
                </p>
              </section>
              <div className="border-t pt-6 mt-4">
                <p className="text-muted-foreground text-sm">
                  Effective date: {new Date().toLocaleDateString()} <br />
                  These Terms may be updated periodically. Continued use after
                  changes constitutes acceptance of the modified Terms.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
