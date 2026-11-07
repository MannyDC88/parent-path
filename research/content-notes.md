# Parent Path: Content Notes (Verified Facts)

> Source material for resource pages and the AI grounding prompt.
> Every fact lists its source and the date it was checked.
> Rule: if it isn't in this file (or verified the same way), it doesn't go in the app or the AI prompt.

**Last updated:** Nov 6, 2026

---

## 1. Early Steps in Broward (birth to 36 months)

| Fact | Source | Checked |
|---|---|---|
| Early Steps is Florida's early intervention system for children birth to 36 months who aren't meeting developmental milestones. | CSC Broward, Early Steps page (cscbroward.org) | Nov 6, 2026 |
| In Broward, the lead agency is the **Children's Diagnostic & Treatment Center (CDTC)**, a nonprofit in Fort Lauderdale. | CSC Broward; FL DOH Early Steps contact list | Nov 6, 2026 |
| Broward referrals go through **Child Find** (Broward County Public Schools central intake). | CSC Broward | Nov 6, 2026 |
| To refer: **Child Find 754-321-7200** or **CDTC 954-728-1083**. Anyone can refer a child, including parents. | CSC Broward; FL DOH Early Steps contact list | Nov 6, 2026 |
| Services can happen at home, in child care, or in other community settings. | CSC Broward | Nov 6, 2026 |
| Early Steps helps families transition to Broward County Schools or other resources when the child turns 3. | CSC Broward | Nov 6, 2026 |
| Federally funded through IDEA Part C. | CSC Broward | Nov 6, 2026 |

**To verify before use:**
- [ ] Eligibility evaluation within **45 calendar days** of referral (s. 391.308, F.S.). Source found is the 2017 statute version; confirm it's current.

---

## 2. Child Find (birth to 5)

| Fact | Source | Checked |
|---|---|---|
| Child Find is the entry point for Exceptional Student Education (ESE) for children birth to 5 in Broward. Children under 3 who need Early Steps are referred for Part C services. | browardschools.com (Child Find page) | Nov 6, 2026 |
| Child Find offers free assessments (speech, language, motor, vision, hearing, learning). | BCPS "Transition from Early Steps to Preschool" brochure (Apr 2022) | Nov 6, 2026 |

**To verify before use:**
- [ ] Florida's timeline for completing a school evaluation after parent consent (federal IDEA default is 60 days; Florida sets its own rule). **Needed for the letter generator. Do not hardcode until verified.**
- [ ] Current Child Find referral form link.

---

## 3. Medicaid: Children's Medical Services (CMS) Plan

**Key insight (from lived experience):** If a child already has Medicaid and has special health care needs, parents must **ask** for a CMS Plan screening. Insurance plans and Medicaid generally won't offer it on their own.

| Fact | Source | Checked |
|---|---|---|
| Request a clinical eligibility screening (or rescreening, any time) via the **Clinical Eligibility Hotline: 1-855-901-5390** (TTY 711), Mon–Fri 8am–5pm. | floridahealth.gov, CMS Plan eligibility page | Nov 6, 2026 |
| Eligibility: meet Medicaid or Florida Healthy Kids financial requirements; age 21 or younger; meet CMS clinical screening requirements **or** have a physician attest to qualifying medical conditions. | cmsplanflorida.gov, eligibility page | Nov 6, 2026 |
| As of **July 1, 2025**, CMS Plan enrollment moved to the Florida Agency for Health Care Administration (AHCA). | floridahealth.gov, CMS Health Plan page | Nov 6, 2026 |

**To verify before use:**
- [ ] Current enrollment phone number after the AHCA transfer (older handbooks list Choice Counseling 1-877-711-3662; confirm still correct).
- [ ] Which company currently operates the CMS Plan.

**Wording rule:** Do NOT say "CMS Plan has no caps on ABA/speech/OT hours." See Section 4: medically necessary coverage applies to all Medicaid children under 21.

---

## 4. EPSDT: Your Child's Right to Medically Necessary Therapy

| Fact | Source | Checked |
|---|---|---|
| Under federal Medicaid law (EPSDT), every Medicaid-enrolled child under 21 is entitled to all medically necessary services to correct or ameliorate a condition. | Florida Health Justice Project fact sheet; AHCA ABA Task Force materials (Oct 2026) | Nov 6, 2026 |
| If a specific amount of therapy is medically necessary, the state or managed care plan must cover that amount. | Florida Health Justice Project, BA Managed Care Carve-In flyer | Nov 6, 2026 |
| Since early 2025, ABA for Medicaid children is delivered through managed care plans (Aetna Better Health, Sunshine Health, Florida Community Care, Simply, Humana, Molina, UnitedHealthcare). | Florida Health Justice Project, BA Managed Care Carve-In flyer | Nov 6, 2026 |
| Florida courts have repeatedly found Florida's medical necessity standard for children overly restrictive and ordered services covered. | Florida Health Justice Project fact sheet | Nov 6, 2026 |
| Families denied a medically necessary service can contact the **Florida Health Justice Project** (floridahealthjustice.org). | Florida Health Justice Project | Nov 6, 2026 |

**Parent tip (plain language):** If your plan denies or cuts therapy hours, that's usually an authorization decision, not a legal cap. You can appeal and request a fair hearing.

**To verify before use:**
- [ ] Appeal and fair hearing steps and deadlines for Florida Medicaid managed care.

---

## 5. Autism Support: UM-NSU CARD (Broward)

| Fact | Source | Checked |
|---|---|---|
| Free services for individuals with autism and related disabilities and their families. | CSC Broward, UM-NSU CARD page | Nov 6, 2026 |
| Broward satellite: main office in Davie, branch office in Miramar. | CSC Broward | Nov 6, 2026 |
| Broward contact: **954-262-7111**, card@nova.edu. | card.miami.edu | Nov 6, 2026 |

**To ask CARD:** Do they keep a Broward provider directory (speech, OT, ABA) we can use as a source?

---

## 6. Other Broward Agencies (from FL DCF resource list, 2023)

| Agency | Phone | Website |
|---|---|---|
| ARC Broward Children's Services | 954-746-9400 | arcbroward.com |
| 211 Broward | 211 | 211-broward.org |
| Broward Legal Aid | 954-765-8950 | browardlegalaid.org |
| Early Learning Coalition of Broward | 954-377-2188 | elcbroward.org |

**To verify before use:** [ ] Re-check each phone and website (list is from 2023).

---

## 7. Verification Sources for the Provider List

| Provider type | Verify with |
|---|---|
| Speech-language pathologists, occupational therapists | FL DOH MQA License Verification (mqa-internet.doh.state.fl.us/MQASearchServices) |
| ABA (BCBA, BCaBA, RBT) | BACB Certificant Registry (bacb.com/verify-certification) |
| All | Provider's own website + a phone call |

**Proposed schema additions** for `providers.json`: `type` ("agency" | "therapy"), `source`, `verifiedHow`.
