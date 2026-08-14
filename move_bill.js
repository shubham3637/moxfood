const fs = require('fs');
const file = 'app/checkout/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// The start of the bill summary section to extract
const startString = '          {/* Bill Summary Section with Collapsible Toggle Disclosure (Taxes & Shipping hidden by default) */}';

const startIndex = content.indexOf(startString);
if (startIndex === -1) {
  console.error('Could not find startString');
  process.exit(1);
}

// Find where the block ends. It ends at the end of the Step 1 block, which is followed by the Step 2 block.
const extractEndString = '        </div>\n\n        {/* Step 2: Customer Information & Delivery Address */}';
let extractEndIndex = content.indexOf(extractEndString, startIndex);

if (extractEndIndex === -1) {
    // try with \r\n
    const extractEndStringWin = '        </div>\r\n\r\n        {/* Step 2: Customer Information & Delivery Address */}';
    extractEndIndex = content.indexOf(extractEndStringWin, startIndex);
}

if (extractEndIndex === -1) {
  console.error('Could not find extractEndIndex');
  process.exit(1);
}

const blockToMove = content.substring(startIndex, extractEndIndex);

// Remove the block from Step 1
let newContent = content.substring(0, startIndex) + content.substring(extractEndIndex);

// Find where to insert below Step 2
// Step 2 ends with:
//           </form>
//         </div>
//       </div>
//
//       {/* Sticky Bottom Action Bar
const step2EndRegex = /          <\/form>\r?\n        <\/div>\r?\n      <\/div>/;
const match = newContent.match(step2EndRegex);

if (!match) {
  console.error('Could not find step2EndRegex');
  process.exit(1);
}

const insertIndex = match.index + match[0].length;

const newLine = content.includes('\r\n') ? '\r\n' : '\n';

const cardWrappedBlock = 
  newLine + newLine +
  '      {/* Step 3: Bill Summary */}' + newLine +
  '      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-3">' + newLine +
  blockToMove
    .replace('className="pt-3 border-t border-slate-100 space-y-3"', 'className="space-y-3"')
    .replace('          {/* Bill', '        {/* Bill') // Adjust indentation slightly if needed, or leave it
    .replace(/^  /gm, ''); // shift left by 2 spaces since it was inside step 1 div

// Wait, the regex replaces indentation. Let's just do it simpler:
let indentedBlock = blockToMove.split(/\r?\n/).map(line => {
    if (line.startsWith('  ')) return line.substring(2);
    return line;
}).join(newLine);
indentedBlock = indentedBlock.replace('className="pt-3 border-t border-slate-100 space-y-3"', 'className="space-y-3"');

const finalInsert = newLine + newLine +
  '      {/* Step 3: Bill Summary */}' + newLine +
  '      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-3">' + newLine +
  indentedBlock +
  '      </div>';

newContent = newContent.substring(0, insertIndex) + finalInsert + newContent.substring(insertIndex);

fs.writeFileSync(file, newContent, 'utf8');
console.log('Successfully moved Bill Summary!');
