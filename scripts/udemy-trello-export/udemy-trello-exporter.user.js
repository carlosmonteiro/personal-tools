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

    async function expandAllSections() {
        const collapsedSections = document.querySelectorAll('[data-testid="section-toggle"][aria-expanded="false"]');
        
        for (const section of collapsedSections) {
            section.click();
            await new Promise(resolve => setTimeout(resolve, 300)); // Wait for expansion
        }
        
        // Wait a bit more for all content to load
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    async function extractCourseContent() {
        // First expand all sections
        await expandAllSections();
        
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

    async function sendAsCardWithChecklists({ courseTitle, courseDescription, content }) {
        const listId = prompt("Enter your Trello List ID:");
        const apiKey = prompt("Enter your Trello API Key:");
        const apiToken = prompt("Enter your Trello API Token:");
        
        if (!listId || !apiKey || !apiToken) {
            alert("All Trello credentials are required to export the course.");
            return;
        }

        const cardRes = await fetch(`https://api.trello.com/1/cards?name=${encodeURIComponent(courseTitle)}&desc=${encodeURIComponent(courseDescription)}&idList=${listId}&key=${apiKey}&token=${apiToken}`, { method: 'POST' });
        const card = await cardRes.json();

        for (const section of content) {
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
                button.innerText = '⏳';
                button.disabled = true;
                
                const courseData = await extractCourseContent();
                const confirmSend = confirm("Export course to Trello as card with checklists?");
                if (confirmSend) await sendAsCardWithChecklists(courseData);
                
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