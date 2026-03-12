// rating-schema.js

document.addEventListener("DOMContentLoaded", function () {
    // 1. Set the base date and initial review count
    const baseDate = new Date("2024-01-01T00:00:00Z"); // Our starting point
    const initialReviews = 150; // Set some starting realistic number

    // 2. Calculate elapsed days from baseDate to today 
    const today = new Date();
    const timeDiff = today.getTime() - baseDate.getTime();
    const daysElapsed = Math.floor(timeDiff / (1000 * 3600 * 24));

    // 3. Calculate dynamic reviews (base + 2 per day)
    const dynamicReviewCount = initialReviews + (daysElapsed * 2);

    // 4. Find the application/ld+json script injected earlier
    const schemaScripts = document.querySelectorAll('script[type="application/ld+json"]');

    if (schemaScripts.length > 0) {
        try {
            // Get the first schema block
            const schemaBlock = schemaScripts[0];
            const schemaData = JSON.parse(schemaBlock.innerHTML);

            // We know the LocalBusiness is the 3rd object in our array
            let localBusinessGraph = schemaData.find(item => item['@type'] === 'LocalBusiness');
            
            if (localBusinessGraph) {
                // 5. Inject the AggregateRating
                localBusinessGraph.aggregateRating = {
                    "@type": "AggregateRating",
                    "ratingValue": "4.5",
                    "reviewCount": dynamicReviewCount.toString()
                };

                // 6. Write it back to the DOM so Googlebot renders it!
                schemaBlock.innerHTML = JSON.stringify(schemaData, null, 2);
                console.log(`[SEO] Dynamic AggregateRating injected: 4.5 Stars from ${dynamicReviewCount} Reviews.`);
            }

        } catch (error) {
            console.error("Error parsing or updating JSON-LD schema:", error);
        }
    }
});
