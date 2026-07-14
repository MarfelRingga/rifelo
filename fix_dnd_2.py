import re

with open('src/app/(dashboard)/profile/page.tsx', 'r') as f:
    content = f.read()

# Using regex to replace the link map block
pattern = re.compile(r'<div className="space-y-4">.*?\{links\.length === 0 && \(', re.DOTALL)
replacement = """<div className="space-y-4">
            <DndContext 
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext 
                items={links.map(l => l.id)}
                strategy={verticalListSortingStrategy}
              >
                {links.map((link) => (
                  <SortableLinkItem
                    key={link.id}
                    link={link}
                    isExpanded={!!expandedLinks[link.id]}
                    toggleLinkExpansion={toggleLinkExpansion}
                    handleToggleVisibility={handleToggleVisibility}
                    handleRemoveLink={handleRemoveLink}
                    handleLinkChange={handleLinkChange}
                    handleLinkBlur={handleLinkBlur}
                  />
                ))}
              </SortableContext>
            </DndContext>
            
            {links.length === 0 && ("""

new_content = pattern.sub(replacement, content)

if new_content != content:
    with open('src/app/(dashboard)/profile/page.tsx', 'w') as f:
        f.write(new_content)
    print("Successfully replaced links map")
else:
    print("Failed to replace links map")

