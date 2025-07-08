// const autonomousCVPrompt = (cvText) => `
// **Role**: You are a professional CV Quality Analyzer. Your task is to evaluate ANY CV based on universal quality standards without needing a job description.

// ### Universal CV Evaluation Criteria:

// 1. **Content Completeness (30%)**:
//    - Essential sections: Contact Info, Summary, Experience, Education, Skills, Projects
//    - Score deduction for missing sections

// 2. **Technical Quality (30%)**:
//    - Skills specification (e.g. "React (3 years)" better than just "React")
//    - Quantifiable achievements (e.g. "Increased performance by 20%")
//    - Relevant keywords density

// 3. **Structure & Readability (20%)**:
//    - Clear section hierarchy
//    - Consistent formatting
//    - Proper grammar/spelling

// 4. **Competitiveness (20%)**:
//    - Unique value proposition
//    - Professional certifications
//    - Notable projects/achievements

// ### Analysis Method:
// 1. Extract ALL detectable information from the CV
// 2. Evaluate against international CV best practices
// 3. NEVER assume missing information
// 4. Provide actionable improvement suggestions

// ### Required Output Format (STRICT JSON):

// \`\`\`json
// {
//   "overall_score": 85,
//   "breakdown": {
//     "content_completeness": 25,
//     "technical_quality": 28,
//     "structure_readability": 18,
//     "competitiveness": 14
//   },
//   "strengths": ["Strong technical skills", "Good project descriptions"],
//   "weaknesses": ["Lack of quantifiable achievements", "Missing summary section"],
//   "improvement_suggestions": [
//     "Add metrics to experience (e.g. 'Improved performance by 20%')",
//     "Include a professional summary section"
//   ],
//   "detected_roles": ["Full-Stack Developer", "Web Developer"],
//   "skill_analysis": {
//     "technical_skills": ["React", "Node.js", "MongoDB"],
//     "soft_skills": ["Teamwork", "Problem-solving"],
//     "skill_gaps": ["Cloud Computing", "CI/CD"]
//   }
// }
// \`\`\`
// **CV Text to Analyze**:
// ${cvText}
// `;
// module.exports = autonomousCVPrompt;
// const autonomousCVPrompt =  (cvText, jobDesc) => `
// You are a powerful Applicant Tracking System (ATS) simulator.

// Evaluate the CV below against the provided job description. Focus on **actual keyword matches**, **skills context**, and **relevance of experience**. 

// Return strictly structured JSON only. Do NOT invent data not found in the CV.

// ---

// ### Job Description:
// ${jobDesc}

// ---

// ### CV:
// ${cvText}

// ---

// ### Your Task:

// Analyze the **match between this CV and the job description** using the following strict metrics:

// - skill_match (40)
// - experience_match (30)
// - keyword_match (20)
// - certification/tools_match (10)

// Also analyze the general **CV quality**:

// - content_completeness (30)
// - technical_clarity (30)
// - readability_structure (20)
// - competitiveness (20)

// Return result in **strict JSON**:

// \`\`\`json
// {
//   "job_match_score": 0-100,
//   "cv_quality_score": 0-100,
//   "breakdown": {
//     "skill_match": 0-40,
//     "experience_match": 0-30,
//     "keyword_match": 0-20,
//     "certification_tools_match": 0-10,
//     "content_completeness": 0-30,
//     "technical_clarity": 0-30,
//     "readability_structure": 0-20,
//     "competitiveness": 0-20
//   },
//   "matched_keywords": [],
//   "missing_keywords": [],
//   "strengths": [],
//   "weaknesses": [],
//   "suggestions": []
// }
// \`\`\`
// `;
// const autonomousCVPrompt = (cvText, jobDesc) => `
// You are a highly intelligent, unbiased, world-class ATS (Applicant Tracking System) and resume analyzer.

// ---

// ## 🎯 Objective:
// Compare the following CV to the provided Job Description as a professional ATS would (e.g., Jobscan, Greenhouse, Lever).  
// Your task is to evaluate the CV **only based on its actual content** and return a detailed analysis in **STRICT JSON format**.  
// You must **not fabricate or assume** information not explicitly mentioned in the resume.

// ---

// ## 📝 Job Description:
// ${jobDesc}

// ---

// ## 📄 Resume:
// ${cvText}

// ---

// ## 🧠 Analysis Instructions:

// Analyze and score the CV across these five categories:

// 1. ### **Searchability (0–20)**
//    - ATS Tip: Does the CV mention the job's company name or its web address?
//    - Contact Info: Does it include valid email, phone number, and location/address?
//    - Headings: Are common resume sections present and clearly labeled? (e.g., Summary, Work Experience, Education, Skills)
//    - Job Title Match: Does the resume mention the job title?
//    - Education Match: Does the resume include the required education/degree?
//    - Date Format: Are work or education dates properly formatted? (e.g., MM/YYYY or YYYY)

// 2. ### **Hard Skills (0–20)**
//    - Extract all hard skills from the job description.
//    - Match them exactly or semantically to what's found in the resume.
//    - Output lists: matched skills and missing skills.

// 3. ### **Soft Skills (0–10)**
//    - Extract all soft skills from the job description.
//    - Match to the resume content.
//    - Output lists: matched soft skills and missing ones.

// 4. ### **Recruiter Tips (0–20)**
//    - Job Level Match: Does the resume show relevant experience/years/seniority?
//    - Measurable Results: Are there quantifiable outcomes (e.g., numbers, %, KPIs)?
//    - Resume Tone: Is language positive and professional?
//    - Web Presence: Does the resume include portfolio links or a LinkedIn profile?

// 5. ### **Formatting (0–10)**
//    - Is the document clean, easy to read, free of images, unusual symbols, or complex tables?
//    - Does it use common fonts, standard margins, consistent layout?

// 6. ### **Overall Match Rate (0–100)**
//    - Calculate a weighted score based on the above categories:
//      - Searchability: 20%
//      - Hard Skills: 20%
//      - Soft Skills: 10%
//      - Recruiter Tips: 20%
//      - Formatting: 10%
//      - (You may include other deductions or bonuses based on completeness and ATS-friendliness)

// ---

// ## 🔁 Output Format (STRICT JSON ONLY):

// \`\`\`json
// {
//   "overall_match_rate": 0-100,
//   "breakdown": {
//     "searchability": 0-20,
//     "hard_skills": 0-20,
//     "soft_skills": 0-10,
//     "recruiter_tips": 0-20,
//     "formatting": 0-10
//   },
//   "matched_hard_skills": [],
//   "missing_hard_skills": [],
//   "matched_soft_skills": [],
//   "missing_soft_skills": [],
//   "strengths": [],
//   "weaknesses": [],
//   "improvement_suggestions": []
// }
// \`\`\`

// **Important Rules:**
// - Do not return text explanations outside the JSON.
// - Do not assume any data not directly present in the resume.
// - Be strict, honest, and objective.

// `;

// module.exports = autonomousCVPrompt;

const sectionedCVPrompt = (cvText, jobDesc) => `
You are a highly advanced ATS and CV analysis engine.

🎯 Task: Analyze the following CV against the job description and return a detailed JSON with **per-section insights**.

🔍 Focus:
- Detect and evaluate each CV section individually
- Compare against job description
- Rate each section and provide feedback
- ONLY use info in the CV (do not guess)

---

## Job Description:
${jobDesc}

---

## CV:
${cvText}

---

## OUTPUT FORMAT (STRICT JSON):

\`\`\`json
{
  "overall_score": 0-100,
  "breakdown": {
    "contact_information": 0-10,
    "professional_summary": 0-10,
    "education": 0-10,
    "experience": 0-20,
    "skills": 0-20,
    "projects": 0-10,
    "certifications": 0-5,
    "languages": 0-5,
    "formatting": 0-10
  },
  "sections": {
    "contact_information": {
      "exists": true,
      "score": 0-10,
      "feedback": {
        "strengths": [],
        "weaknesses": [],
        "suggestions": []
      }
    },
    "professional_summary": {
      "exists": true,
      "score": 0-10,
      "feedback": {
        "strengths": [],
        "weaknesses": [],
        "suggestions": []
      }
    },
    "education": {
      "exists": true,
      "score": 0-10,
      "feedback": {
        "matched_degrees": [],
        "missing_requirements": [],
        "suggestions": []
      }
    },
    "experience": {
      "exists": true,
      "score": 0-20,
      "feedback": {
        "years_of_experience": "",
        "quantifiable_achievements": [],
        "improvement_opportunities": []
      }
    },
    "skills": {
      "exists": true,
      "score": 0-20,
      "matched_hard_skills": [],
      "missing_hard_skills": [],
      "matched_soft_skills": [],
      "missing_soft_skills": [],
      "suggestions": []
    },
    "projects": {
      "exists": true,
      "score": 0-10,
      "feedback": {
        "notable_projects": [],
        "technologies_used": [],
        "suggestions": []
      }
    },
    "certifications": {
      "exists": true,
      "score": 0-5,
      "feedback": {
        "matched_certs": [],
        "missing_relevant_certs": [],
        "suggestions": []
      }
    },
    "languages": {
      "exists": true,
      "score": 0-5,
      "feedback": {
        "matched_languages": [],
        "suggestions": []
      }
    },
    "formatting": {
      "score": 0-10,
      "issues": [],
      "suggestions": []
    }
  },
  "final_suggestions": [
    "Tailor the summary to the job title",
    "Add metrics in the experience section",
    "Improve formatting for ATS readability"
  ]
}
\`\`\`

ONLY return valid JSON. No extra explanations.
`;

export default sectionedCVPrompt;
