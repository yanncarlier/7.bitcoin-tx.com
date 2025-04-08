import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsOfService() {
  return (
    <section className="bg-gray-900 text-white py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-orange-500">
              Terms of Service
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              <section className="flex flex-col gap-4">
                <h2 id="terms-of-service">Terms of Service</h2>
                <p>Last updated March 22, 2025 </p>
                <p>
                  This is a contract (the “Agreement”) between you and
                  Bitcoin-tx.{" "}
                  {/* Ltd (“Bitcoin-tx,” “we,” or “us”), a company registered and
                incorporated under the laws of [Insert Jurisdiction, e.g.,
                Delaware, USA] with company number [Insert Number] and whose
                registered office is [Insert Address].  */}
                  References in this Agreement to “you” and “your” are to the
                  person with whom Bitcoin-tx enters into this Agreement.{" "}
                </p>
                <p>
                  By clicking “I agree” or similar terms when creating a Wallet
                  (as defined below) through{" "}
                  <a href="http://www.bitcoin-tx.com">www.bitcoin-tx.com</a> or
                  any of our associated browser extensions, websites, APIs, or
                  mobile applications (collectively, the “Services”), or by
                  proceeding with a download or update for a Wallet when offered
                  a choice of proceeding or not, you are agreeing to be bound by
                  the terms and conditions found in this Agreement. You
                  represent and warrant that you have the power and capacity to
                  enter into this Agreement.{" "}
                </p>
                <h2 id="acceptance-of-terms">Acceptance of Terms</h2>
                <p>
                  By accessing or using Bitcoin-tx services, you agree to be
                  bound by these Terms of Service. If you disagree with any
                  part, you may not access our platform.
                </p>
                <h2 id="account-security-responsibilities">
                  Account Security Responsibilities
                </h2>
                <p>
                  You are responsible for maintaining the confidentiality of
                  your account credentials and all activities under your
                  account.
                </p>
                <h2 id="prohibited-activities">Prohibited Activities</h2>
                <p>
                  You agree not to engage in any illegal activities or violate
                  any laws through our platform.
                </p>
                <h2 id="bitcoin-tx-services">Bitcoin-tx Services</h2>
                <p>
                  Bitcoin TX provides decentralized online and offline storage
                  custody solutions for digital assets. We are not responsible
                  for any loss of assets due to user error. The Bitcoin-tx
                  Services enable you to create one or more multi-signature,
                  hierarchical deterministic (HD), non-custodial cryptocurrency
                  wallets for certain supported digital assets (“Wallet”) and to
                  use the Wallet to store, send, request, and receive supported
                  digital assets.{" "}
                </p>
                <p>
                  Our Services are intended for use by persons who are highly
                  knowledgeable about cryptocurrency and HD non-custodial
                  wallets. By using our Services, you represent that you qualify
                  as such a person and have carefully reviewed our content.{" "}
                </p>
                <h2 id="supported-digital-assets">Supported Digital Assets</h2>
                <p>
                  Our Services, including any Wallet, are for use with Bitcoin
                  (BTC) ecosystem only and any other digital assets we may
                  explicitly decide to support in the future at our discretion
                  (“Digital Assets”). We have no obligation to support any
                  digital assets (including but not limited to forkcoins,
                  altcoins, airdrops, or other digital assets) beyond Bitcoin or
                  those we explicitly choose to support. We assume no
                  responsibility or liability for any attempt to use your Wallet
                  for unsupported digital assets. Keys or signatures held or
                  produced by us belong to us, and we reserve all associated
                  rights.{" "}
                </p>
                <h2 id="responsibility-for-mnemonics-pins-and-other-authentication-means">
                  Responsibility for Mnemonics, PINs, and Other Authentication
                  Means
                </h2>
                <p>
                  Our Services provide various methods to secure your Wallet,
                  including mnemonics, personal identification numbers (PINs),
                  two-factor authentication, and multi-signature options (e.g.,
                  2of2 or 2of3 signing). We do not store or have access to your
                  mnemonics, PINs, or private keys.{" "}
                </p>
                <p>
                  You are solely responsible for safeguarding your mnemonics,
                  PINs, two-factor authentication methods, and any other
                  security measures provided. If you lose or forget these
                  authentication means, Bitcoin-tx cannot recover them, and you
                  may permanently lose access to any Digital Assets in your
                  Wallet.{" "}
                </p>
                <h2 id="mnemonics-and-catastrophic-impact-of-their-loss-or-misappropriation">
                  Mnemonics and Catastrophic Impact of Their Loss or
                  Misappropriation
                </h2>
                <p>
                  When you create a Wallet, our software generates a random
                  24-word mnemonic phrase as a seed for your BIP32 hierarchical
                  wallet. This mnemonic contains all the information needed to
                  recover your Wallet if other authentication methods fail. For
                  certain Wallet types (e.g., 2of2 non-CSV), retaining recovery
                  nlocktime files may also be required for recovery.{" "}
                </p>
                <p>
                  Bitcoin-tx does not store, access, or have any means to
                  recover your mnemonic. It is your responsibility to keep it
                  secure and not share it with anyone, including Bitcoin-tx
                  representatives. If you lose your mnemonic, you will
                  permanently lose access to your Wallet and suffer a complete,
                  irrecoverable loss of all Digital Assets stored therein.
                  Bitcoin-tx is not liable for any loss or damage resulting from
                  the loss or misappropriation of your mnemonic.{" "}
                </p>
                <h2 id="recovery-feature-and-risks">
                  Recovery Feature and Risks
                </h2>
                <p>
                  We may offer a recovery feature for 2of2 signature Wallets to
                  protect against loss of access if our Services become
                  unavailable. This feature requires you to have secured your
                  mnemonic. It includes a default waiting period before you can
                  transfer Digital Assets, adjustable in your Wallet settings.
                  During this period, if our Services are unavailable or you
                  lose all two-factor authentication means, your Digital Assets
                  will be illiquid, exposing you to market risks. Bitcoin-tx is
                  not responsible for such risks or losses.{" "}
                </p>
                <h2 id="two-factor-authentication-reset">
                  Two-Factor Authentication Reset
                </h2>
                <p>
                  If you lose all two-factor authentication methods but retain
                  your mnemonic, you may initiate a two-factor reset within your
                  Wallet. This process includes a grace period of at least one
                  year, during which your Wallet will be read-only, and you
                  cannot transact or transfer Digital Assets. This period may be
                  extended by unexpired recovery periods or disputes. Disputes
                  can halt the reset process, and Bitcoin-tx’s resolution of
                  disputes is final and binding, potentially resulting in
                  permanent inaccessibility of your Wallet.{" "}
                </p>
                <h2 id="intellectual-property">Intellectual Property</h2>
                <p>
                  We grant you a limited, personal, non-transferable,
                  non-exclusive license to access and use the Website and
                  Services as provided by Bitcoin-tx, subject to this Agreement
                  and solely for approved purposes. Certain software may be
                  licensed under open-source terms. All other rights, titles,
                  and interests in the Website and Services belong to Bitcoin-tx
                  and, and you may not use them without prior written consent.{" "}
                </p>
                <p>Third Party Integrations</p>
                <p>
                  Our Services may integrate with third-party services. We are
                  not responsible for these services or any loss or damage they
                  may cause.{" "}
                </p>
                <h2 id="changes-to-or-termination-of-our-services">
                  Changes to or Termination of Our Services
                </h2>
                <p>
                  We may modify or discontinue features of our Services at any
                  time. You may stop using our Services at any time. We may
                  terminate our Services at our discretion, endeavoring to
                  provide advance notice but with no obligation to do so. If
                  Services end abruptly, the recovery feature may allow
                  transfers after the recovery period, though you will face the
                  risks outlined in “Recovery Feature and Risks.” Bitcoin-tx is
                  not liable for losses due to termination or inaccessibility
                  during recovery periods.{" "}
                </p>
                <h2 id="your-compliance-with-applicable-laws">
                  Your Compliance with Applicable Laws
                </h2>
                <p>
                  You represent and warrant that your use of the Services
                  complies with applicable laws and is not for illegal purposes,
                  such as gambling, fraud, money laundering, or terrorism
                  financing.{" "}
                </p>
                <h2 id="disclaimer-of-warranties">Disclaimer of Warranties</h2>
                <p>
                  All Bitcoin-tx Services, including any Wallet, are provided
                  “as is” and “as available” without any warranties, express or
                  implied, to the fullest extent permitted by law. We disclaim
                  warranties of title, merchantability, fitness for a particular
                  purpose, and non-infringement.{" "}
                </p>
                <p>Exclusion and Limitation of Liability</p>
                <p>
                  Bitcoin-tx, its directors, officers, employees, suppliers,
                  agents, or affiliates will not be liable for any direct,
                  indirect, special, consequential, exemplary, or punitive
                  damages arising from your use of the Services or Wallet,
                  including loss of Digital Assets or inability to access them.
                  This includes, but is not limited to, losses due to:{" "}
                </p>
                <ul>
                  <li>Brute-force attacks on your Wallet; </li>
                  <li>Server failure, hacks, or unavailability; </li>
                  <li>Forgotten mnemonics or passwords; </li>
                  <li>Lost two-factor authentication methods; </li>
                  <li>
                    Inability to transact during reset grace periods or
                    disputes;{" "}
                  </li>
                  <li>Errors in network fees or transaction construction; </li>
                  <li>Phishing or impersonation sites.</li>
                </ul>
                <p>
                  Our total aggregate liability for all claims is limited to USD
                  50. These exclusions are subject to applicable law, including
                  liability for fraud, gross negligence, or willful misconduct.{" "}
                </p>
                <h2 id="indemnification">Indemnification</h2>
                <p>
                  You will indemnify and hold harmless Bitcoin-tx and its
                  affiliates from any claims, losses, or damages arising from
                  your use of the Services or violation of this Agreement,
                  including legal fees.{" "}
                </p>
                <p>What Bitcoin-tx Does Not Do</p>
                <p>
                  We do not exchange digital currency for fiat, issue or redeem
                  digital currency, or control your Wallet or Digital Assets. We
                  are not a bank, custodian, exchange, or regulated financial
                  institution. Prices displayed via third-party services do not
                  guarantee exchangeability. We do not control or guarantee the
                  value, functionality, or security of Digital Assets or their
                  underlying protocols.{" "}
                </p>
                <p>Information on Our Website</p>
                <p>
                  Website content is for general information only. We strive for
                  accuracy but make no warranties about its completeness,
                  reliability, or suitability. Reliance on this information is
                  at your own risk.{" "}
                </p>
                <h2 id="governing-law-and-dispute-resolution">
                  Governing Law and Dispute Resolution
                </h2>
                <p>
                  (a) If you reside outside the United States, this Agreement is
                  governed by [Insert Jurisdiction, e.g., English] law and the
                  non-exclusive jurisdiction of [Insert Jurisdiction, e.g.,
                  English] courts, subject to additional consumer protections in
                  your home jurisdiction if applicable. (b) If you reside in the
                  United States, this Agreement is governed by California law
                  (excluding conflict of laws), and disputes will be resolved
                  through binding arbitration under the American Arbitration
                  Association’s consumer rules, conducted in your county or a
                  mutually agreed location. You waive jury trials and class
                  actions. The arbitrator’s decision is enforceable in court,
                  and the prevailing party recovers costs and fees. If any
                  arbitration provision is invalid, the rest of this Agreement
                  remains effective.{" "}
                </p>
                <h2 id="data-protection">Data Protection</h2>
                <p>
                  We may collect and process personal data related to you or
                  your associates in connection with this Agreement. See our
                  Privacy Policy for details.{" "}
                </p>
                <h2 id="miscellaneous">Miscellaneous</h2>
                <p>
                  No waiver of rights occurs through inaction. We may amend this
                  Agreement with notice; your remedy for disagreement is to stop
                  using the Services. You may not assign this Agreement, but we
                  may. It governs our relationship without creating third-party
                  rights. Use of the Services is subject to export controls and
                  sanctions; you may not use them if in a sanctioned country
                  (e.g., Cuba, Iran) or on a sanctioned list. Terms surviving
                  termination remain binding. Invalid terms do not affect
                  others. This Agreement is the entire understanding between us.{" "}
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
