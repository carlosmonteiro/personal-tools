// ==UserScript==
// @name         Udemy to Trello Exporter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Export Udemy course as a single card with checklists to Trello
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
        alert(`Expansion complete! Found ${sections.length} sections, expanded ${expandedCount} collapsed ones. Ready to export to Trello.`);
        
        return true; // Signal that expansion is complete
    }

    async function extractCourseContent() {
        const sections = document.querySelectorAll('div.accordion-panel-module--panel--Eb0it');
        if (!sections.length) throw new Error("No course sections found.");

        const courseTitle = '[Udemy] ' + document.title.split("|")[0].trim();

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

    async function sendAsCardWithChecklists({ courseTitle, courseDescription, content }, button) {
        const listId = prompt("Enter your Trello List ID:");
        const apiKey = prompt("Enter your Trello API Key:");
        const apiToken = prompt("Enter your Trello API Token:");
        
        if (!listId || !apiKey || !apiToken) {
            alert("All Trello credentials are required to export the course.");
            return;
        }

        button.innerText = 'Creating card...';
        const cardRes = await fetch(`https://api.trello.com/1/cards?name=${encodeURIComponent(courseTitle)}&desc=${encodeURIComponent(courseDescription)}&idList=${listId}&key=${apiKey}&token=${apiToken}`, { method: 'POST' });
        const card = await cardRes.json();

        for (let i = 0; i < content.length; i++) {
            const section = content[i];
            button.innerText = `Exporting ${i + 1}/${content.length} sections...`;
            
            const checklistRes = await fetch(`https://api.trello.com/1/checklists?name=${encodeURIComponent(section.section)}&idCard=${card.id}&key=${apiKey}&token=${apiToken}`, { method: 'POST' });
            const checklist = await checklistRes.json();

            for (const item of section.lectures) {
                await fetch(`https://api.trello.com/1/checklists/${checklist.id}/checkItems?name=${encodeURIComponent(item)}&key=${apiKey}&token=${apiToken}`, { method: 'POST' });
            }
        }

        alert('Course exported to Trello successfully!');
    }

    function createButton() {
        const button = document.createElement('button');
        button.innerText = '📤';
        button.style.position = 'fixed';
        button.style.top = '80px';
        button.style.left = '6px';
        button.style.zIndex = 10000;
        button.style.padding = '10px 14px';
        button.style.backgroundColor = '#0079bf';
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
                    // Phase 2: Export to Trello
                    const confirmSend = confirm("All sections are now expanded. Export course to Trello as card with checklists?");
                    if (confirmSend) {
                        const courseData = await extractCourseContent();
                        await sendAsCardWithChecklists(courseData, button);
                    }
                }
                
                button.innerText = '📤';
                button.disabled = false;
            } catch (err) {
                alert("⚠️ You need to be on the course curriculum page with sections loaded.");
                console.error('[Udemy to Trello] Error:', err);
                button.innerText = '📤';
                button.disabled = false;
            }
        });

        document.body.appendChild(button);
    }

    window.addEventListener('load', () => {
        window.setTimeout(createButton, 3000);
    });
})();