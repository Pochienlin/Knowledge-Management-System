A Knowledge Management System (KMS) primarily serves as a means to extend the capabilities of human-based cognition in a predictable, systematic manner. As knowledge itself may or may not be accumulated with an end in mind, a KMS ought not be designed the way a data pipeline or cron job would in an enterprise setting, though some form of automation may benefit backend processes.

# Objectives
I conceive of knowledge management to largely comprise a few key processes:
1. Factual storage - this concerns fidelity to information captured. Under this we may include raw data, primary or secondary sources
2. Conceptual storage - the line between concepts and facts may not be clear, but concepts may require differing properties when considered, as there likely would be contextual backgrounds to concepts
3. Relating concepts - above the storage layer, there may be concepts that interact with each other. Each of this relationship is itself a form of knowledge 
4. Network of concepts - concepts may exceed point-to-point connection, in which a mesh of inter-related concepts form a cluster in which the clustering itself holds knowledge that extends beyond the sum of the links between them 
5. Presentation of knowledge - this is a layer that sites above the link layers to create a consolidated form of knowledge made for consumption via a medium (e.g. an article, a slide deck, a book, a video)
6. Ingestion of knowledge - interfacing with an inlet to introduce consumed knowledge artifacts (themselves presented knowledge) from outside of the system
7. Digestion of knowledge - breaking down of ingested knowledge into parts suitable for storage 
8. Knowledge synthesis - process of converting sporadic concepts and facts into interrelated concepts.

![[Drawing 2026-03-14 14.48.35.excalidraw]]

# Ingestion and digestion
## Sources for ingestion
- User inserted files via downloads to system root folder or created via Obsidian / similar markdown editors
	- `.md` default for text, with possible metadata headers
	- `.pdf, .epub` for references
	- `.csv, .db` for static data (`.db` will follow sqlite format)
- API data sources for real-time data
	- This may be used for IoT, email automation etc
- Custom data ingestion adapators may be written

The objective for the ingestion step is for a local data pool to be set up with valid inlets for relevant input data of all foreseeable formats

## Formats for digestion
- For factual and conceptual knowledge, the end state of digestion would be to
	1. Pull new information from ingestion pool
	2. Process each piece of knowledge into atomized notes
		1. In the concept of zettlekasten notes - have one note for one self-containing idea
		2. Include attribution for traceability
	3. If a similar or identical concept already exist, fuse both notes
	4. Create a synthesized note that pulls from the ingestion pool source with the concepts linked
- For some factual data (statistics and the like), an ontological object type should be set in place to convert the raw data into a recognizable format native to the system
	- Each introduction of an input form should correspond to a predefined data type
	- The system should implement some type of CRUD function to update the pool of data into an RDBMS