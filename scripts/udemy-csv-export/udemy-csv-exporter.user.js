// ==UserScript==
// @name         Udemy to CSV Exporter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Export Udemy course as CSV file with sections and lectures
// @match        https://*.udemy.com/course/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    async function expandAllSections(button) {
        button.innerText = 'Finding sections...';
        
        // Phase 1: Make all sections visible
        console.log('[Udemy Exporter] Phase 1: Making all sections visible...');
        
        // Look for "Show more sections" button
        const showMoreButtons = document.querySelectorAll('button');
        for (const btn of showMoreButtons) {
            const text = btn.textContent.toLowerCase();
            if (text.includes('show more') || text.includes('expand') || text.includes('see all') || text.includes('sections')) {
                console.log('[Udemy Exporter] Clicking show more button:', btn.textContent);
                btn.click();
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
        
        button.innerText = 'Expanding sections...';
        
        // Phase 2: Expand all collapsed sections
        console.log('[Udemy Exporter] Phase 2: Expanding collapsed sections...');
        
        const sections = document.querySelectorAll('div.accordion-panel-module--panel--Eb0it');
        console.log(`[Udemy Exporter] Found ${sections.length} total sections`);
        let expandedCount = 0;
        
        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];
            button.innerText = `Expanding ${i + 1}/${sections.length}...`;
            
            // Check if section has visible lectures
            const hasVisibleLectures = section.querySelectorAll('.curriculum-item-link--curriculum-item--KX8XG').length > 0;
            
            if (!hasVisibleLectures) {
                const expandButton = section.querySelector('button[aria-expanded="false"]') || 
                                   section.querySelector('[data-testid="section-toggle"][aria-expanded="false"]') ||
                                   section.querySelector('.section--section-title--svpHP button');
                
                if (expandButton) {
                    expandButton.click();
                    expandedCount++;
                    await new Promise(resolve => setTimeout(resolve, 500));
                } else {
                    const sectionHeader = section.querySelector('.section--section-title--svpHP');
                    if (sectionHeader && sectionHeader.getAttribute('aria-expanded') === 'false') {
                        sectionHeader.click();
                        expandedCount++;
                        await new Promise(resolve => setTimeout(resolve, 500));
                    }
                }
            }
        }
        
        button.innerText = 'Ready to export!';
        console.log(`[Udemy Exporter] Expansion complete: ${expandedCount} sections expanded`);
        alert(`Expansion complete! Found ${sections.length} sections, expanded ${expandedCount} collapsed ones. Ready to export to CSV.`);
        
        return true; // Signal that expansion is complete
    }

    async function extractCourseContent() {
        const sections = document.querySelectorAll('div.accordion-panel-module--panel--Eb0it');
        if (!sections.length) throw new Error("No course sections found.");

        const courseTitle = document.title.split("|")[0].trim();

        let courseDescription = '';
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            courseDescription = metaDescription.getAttribute('content') || '';
        }

        const content = Array.from(sections).map(section => {
            const sectionTitle = section.querySelector(".section--section-title--svpHP")?.innerText.trim();
            const lectures = Array.from(section.querySelectorAll('[data-testid="course-lecture-title"]'))
                .map(el => el.innerText.trim())
                .filter(Boolean);

            if (!sectionTitle || lectures.length === 0) return null;
            return { section: sectionTitle, lectures };
        }).filter(Boolean);

        return { courseTitle, courseDescription, content };
    }

    function generateCSV({ courseTitle, courseDescription, content }, button) {
        button.innerText = 'Generating CSV...';
        
        // CSV Headers
        let csvContent = 'Course,Section,Lecture,Completed\n';
        
        // Add course data
        for (let i = 0; i < content.length; i++) {
            const section = content[i];
            button.innerText = `Processing ${i + 1}/${content.length} sections...`;
            
            for (const lecture of section.lectures) {
                // Escape quotes and commas in CSV
                const escapedCourse = `"${courseTitle.replace(/"/g, '""')}"`;
                const escapedSection = `"${section.section.replace(/"/g, '""')}"`;
                const escapedLecture = `"${lecture.replace(/"/g, '""')}"`;
                
                csvContent += `${escapedCourse},${escapedSection},${escapedLecture},FALSE\n`;
            }
        }
        
        return csvContent;
    }

    function downloadCSV(csvContent, filename) {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    function createButton() {
        const button = document.createElement('button');
        button.innerText = '📊';
        button.style.position = 'fixed';
        button.style.top = '80px';
        button.style.left = '50px';
        button.style.zIndex = 10000;
        button.style.padding = '10px 14px';
        button.style.backgroundColor = '#28a745';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.fontSize = '13px';
        button.style.cursor = 'pointer';

        button.addEventListener('click', async () => {
            try {
                button.disabled = true;
                
                // Phase 1: Expand all sections
                const expansionComplete = await expandAllSections(button);
                
                if (expansionComplete) {
                    // Phase 2: Export to CSV
                    const confirmSend = confirm("All sections are now expanded. Export course to CSV file?");
                    if (confirmSend) {
                        const courseData = await extractCourseContent();
                        const csvContent = generateCSV(courseData, button);
                        
                        button.innerText = 'Downloading...';
                        const filename = `${courseData.courseTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.csv`;
                        downloadCSV(csvContent, filename);
                        
                        alert('Course exported to CSV successfully!');
                    }
                }
                
                button.innerText = '📊';
                button.disabled = false;
            } catch (err) {
                alert("⚠️ You need to be on the course curriculum page with sections loaded.");
                console.error('[Udemy to CSV] Error:', err);
                button.innerText = '📊';
                button.disabled = false;
            }
        });

        document.body.appendChild(button);
    }

    window.addEventListener('load', () => {
        window.setTimeout(createButton, 3000);
    });
})();
